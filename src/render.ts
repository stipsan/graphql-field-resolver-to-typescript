import { Root, TypeDef, Field, Argument, EnumValue, InputField } from './model'
import { source, OMIT_NEXT_NEWLINE } from './renderTag'

export interface Options {
  tslint?: Object
}

export class Renderer {
  private options: Options

  /**
   * Types that are not created as interface, because they are part of the introspection
   */
  private introspectionTypes: { [key: string]: boolean } = setOf([
    '__Schema',
    '__Type',
    '__TypeKind',
    '__Field',
    '__InputValue',
    '__EnumValue',
    '__Directive',
    '__DirectiveLocation',
  ])

  constructor(options: Options) {
    this.options = options
  }

  /**
   * Render the whole schema as interface
   */
  render(root: Root): string {
    const namespace = source`
type ID = string;
export type GraphqlField<Source, Args, Result, Ctx> =
  Result |
  Promise<Result> |
  (
    ( source:Source,
      args:Args,
      context:Ctx,
      info:GraphQLResolveInfo
    ) => Result | Promise<Result>
  )

${this.renderTypes(root.data.__schema.types)}
${this.renderArguments(root.data.__schema.types)}
${this.renderInputObjects(root.data.__schema.types)}
${this.renderEnums(root.data.__schema.types)}
${this.renderUnions(root.data.__schema.types)}
${this.renderInterfaces(root.data.__schema.types)}
${this.renderDefaultResolvers(root.data.__schema.types)}
`

    return `/* tslint:disable */
import {GraphQLResolveInfo} from "graphql";
${namespace.replace(/^\s+$/gm, '')}`
  }

  /**
   * Render a list of type (i.e. interfaces)
   */
  renderTypes(types: TypeDef[]) {
    return types
      .filter(type => !this.introspectionTypes[type.name])
      .filter(type => type.kind === 'OBJECT')
      .map(type => this.renderTypeDef(type, types))
      .join('\n\n')
  }

  /**
   * Render a Type (i.e. an interface)
   */
  renderTypeDef(type: TypeDef, all: TypeDef[]): string {
    return source`
${this.renderComment(type.description)}
export interface ${type.name}<Ctx> ${this.renderExtends(type)}{
    ${this.renderTypename(type.name, all)}${OMIT_NEXT_NEWLINE}
${type.fields
      .map(field => this.renderMemberWithComment(field, type.name))
      .join('\n')}
}
`
  }

  /**
   * Renders a __typename constant if the type is used in a union or interface.
   */
  renderTypename(forType: string, all: TypeDef[]): string {
    const usedBy = all
      .filter(type => !this.introspectionTypes[type.name])
      .filter(type => type.kind === 'UNION' || type.kind === 'INTERFACE')
      .filter(
        type =>
          type.possibleTypes.filter(cand => cand.name === forType).length > 0
      )
    if (usedBy.length === 0) {
      return ''
    }
    return `__typename: '${forType}'\n`
  }

  /**
   * Renders the extends clause of an interface (e.g. 'extends A, B. C').
   */
  renderExtends(type: TypeDef): string {
    if (type.interfaces && type.interfaces.length > 0) {
      const interfaces = type.interfaces.map(it => `${it.name}<Ctx>`).join(', ')
      return `extends ${interfaces} `
    } else {
      return ''
    }
  }

  /**
   * Render a member (field or method) and its doc-comment
   */
  renderMemberWithComment(field: Field, parentTypeName: string): string {
    return source`
${this.renderComment(field.description)}
${this.renderMember(field, parentTypeName)}
`
  }

  /**
   * Render a single field or method without doc-comment
   */
  renderMember(field: Field, parentTypeName: string) {
    const optional = field.type.kind !== 'NON_NULL'
    const type = this.renderType(field.type, false)
    const resultType = optional ? `${type} | undefined` : type
    const argType = field.args.length
      ? `${field.name}Args`
      : this.renderArgumentType(field.args || [])
    const name = optional ? field.name + '?' : field.name
    const source = parentTypeName ? parentTypeName + '<Ctx>' : 'undefined'
    return `${name}: GraphqlField<${source}, ${argType}, ${resultType}, Ctx>`
  }

  /**
   * Render a single return type (or field type)
   * This function creates the base type that is then used as generic to a promise
   */
  renderType(type, optional: boolean) {
    function maybeOptional(arg) {
      return optional ? `(${arg} | undefined)` : arg
    }
    function generic(arg) {
      return `${arg}<Ctx>`
    }

    switch (type.kind) {
      case 'SCALAR':
        return maybeOptional(scalars[type.name])
      case 'ENUM':
      case 'INPUT_OBJECT':
        return maybeOptional(type.name)
      case 'OBJECT':
      case 'UNION':
      case 'INTERFACE':
        return maybeOptional(generic(type.name))
      case 'LIST':
        return maybeOptional(`${this.renderType(type.ofType, true)}[]`)
      case 'NON_NULL':
        return this.renderType(type.ofType, false)
    }
  }

  /**
   * Render a description as doc-comment
   */
  renderComment(description: string): string | typeof OMIT_NEXT_NEWLINE {
    if (!description) {
      // Parsed by the `source` tag-function to remove the next newline
      return OMIT_NEXT_NEWLINE
    }
    return `/**\n * ` + description.split('\n').join(`\n * `) + `\n */`
  }

  /**
   * Render the arguments of a function
   */
  renderArgumentType(args: Argument[]) {
    const base = args
      .map(arg => {
        return `${arg.name}: ${this.renderType(arg.type, false)}`
      })
      .join(', ')
    return `{${base}}`
  }

  /**
   * Render a list of enums.
   */
  renderEnums(types: TypeDef[]) {
    return types
      .filter(type => !this.introspectionTypes[type.name])
      .filter(type => type.kind === 'ENUM')
      .map(type => this.renderEnum(type))
      .join('\n')
  }

  /**
   * Render an Enum.
   */
  renderEnum(type: TypeDef): string {
    return source`
${this.renderComment(type.description)}
export type ${type.name} = ${type.enumValues
      .map(value => `'${value.name}'`)
      .join(' | ')}
export const ${type.name}: { ${type.enumValues
      .map(value => this.renderEnumValueType(value))
      .join(' ')} } = { ${type.enumValues
      .map(value => this.renderEnumValue(value))
      .join(' ')}}`
  }

  /**
   * Renders a type definition for an enum value.
   */
  renderEnumValueType(value: EnumValue): string {
    return source`
${value.name}: '${value.name}',
`
  }

  /**
   * Renders a the definition of an enum value.
   */
  renderEnumValue(value: EnumValue): string {
    return source`
${this.renderComment(value.description)}
${value.name}: '${value.name}',
`
  }

  /**
   * Render a list of unions.
   */
  renderUnions(types: TypeDef[]) {
    return types
      .filter(type => !this.introspectionTypes[type.name])
      .filter(type => type.kind === 'UNION')
      .map(type => this.renderUnion(type))
      .join('\n')
  }

  /**
   * Render a union.
   */
  renderUnion(type: TypeDef): string {
    // Scalars cannot be used in unions, so we're safe here
    const unionValues = type.possibleTypes
      .map(type => `${type.name}<Ctx>`)
      .join(' | ')
    return source`
${this.renderComment(type.description)}
export type ${type.name}<Ctx> = ${unionValues}

`
  }

  /**
   * Render a list of interfaces.
   */
  renderInterfaces(types: TypeDef[]) {
    return types
      .filter(type => !this.introspectionTypes[type.name])
      .filter(type => type.kind === 'INTERFACE')
      .map(type => this.renderInterface(type))
      .join('\n')
  }

  /**
   * Render an interface.
   */
  renderInterface(type: TypeDef): string {
    return source`
${this.renderComment(type.description)}
export interface ${type.name}<Ctx> {
    ${type.fields
      .map(field => this.renderMemberWithComment(field, type.name))
      .join('\n')}
}
`
  }

  renderArguments(types) {
    return types
      .filter(type => !this.introspectionTypes[type.name])
      .filter(
        type =>
          type.name === 'Mutation' ||
          type.name === 'Query' ||
          type.name === 'Subscription'
      )
      .map(type => type.fields)
      .reduce((memo, fields) => memo.concat(fields), [])
      .map(type => renderInputsInterfaces(type, types))
      .join('')

    function renderInputsInterfaces(type, all) {
      return `
export interface ${type.name}Args {
${type.args.map(renderArg).join('\n')}
}
`
    }

    function renderArg(arg) {
      const optional = arg.type.kind === 'NON_NULL' ? '' : '?'
      const type = arg.type.ofType ? arg.type.ofType.name : arg.type.name
      return `    ${arg.name}${optional}: ${type}`
    }
  }

  /**
   * Render a list of input object.
   */
  renderInputObjects(types: TypeDef[]) {
    return types
      .filter(type => !this.introspectionTypes[type.name])
      .filter(type => type.kind === 'INPUT_OBJECT')
      .map(type => this.renderInputObject(type))
      .join('\n')
  }

  /**
   * Render an input object.
   */
  renderInputObject(type: TypeDef): string {
    return source`
${this.renderComment(type.description)}
export interface ${type.name} {
    ${type.inputFields
      .map(field => this.renderInputMemberWithComment(field))
      .join('\n')}
}
`
  }

  /**
   * Render a input member (field or method) and its doc-comment
   */
  renderInputMemberWithComment(field: InputField): string {
    return source`
${this.renderComment(field.description)}
${this.renderInputMember(field)}
`
  }

  /**
   * Render a single input field or method without doc-comment
   */
  renderInputMember(field: InputField) {
    const type = this.renderType(field.type, false)
    // Render property as field, with the option of being of a function-type () => ReturnValue
    const optional = field.type.kind !== 'NON_NULL'
    const name = optional ? field.name + '?' : field.name
    return `${name}: ${type}`
  }

  /**
   * Render a default resolver that implements resolveType for all unions and interfaces.
   */
  renderDefaultResolvers(types: TypeDef[]): string {
    const resolvers = types
      .filter(type => !this.introspectionTypes[type.name])
      .filter(type => type.kind === 'UNION' || type.kind === 'INTERFACE')
      .map(type => this.renderResolver(type))
      .join(',\n')
    return source`\n
export const defaultResolvers = {
${resolvers}
};`
  }

  /**
   * Renders a single resolver.
   */
  renderResolver(type: TypeDef): string {
    return source`
    ${type.name}: {
        __resolveType(obj) {
            return obj.__typename
        }
    }`
  }
}

const scalars = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  ID: 'string',
}

/**
 * Covert an array of strings into an object in which each string is a key with value 'true'
 */
function setOf(array: string[]): { [key: string]: boolean } {
  return array.reduce((set, current): { [key: string]: boolean } => {
    set[current] = true
    return set
  }, {})
}

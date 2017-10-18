"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderTag_1 = require("./renderTag");
class Renderer {
    constructor(options) {
        /**
         * Types that are not created as interface, because they are part of the introspection
         */
        this.introspectionTypes = setOf([
            '__Schema', '__Type', '__TypeKind', '__Field', '__InputValue', '__EnumValue',
            '__Directive', '__DirectiveLocation'
        ]);
        this.options = options;
    }
    /**
     * Render the whole schema as interface
     * @param root
     * @returns {string}
     */
    render(root) {
        const namespace = renderTag_1.source `
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
`;
        return `/* tslint:disable */
import {GraphQLResolveInfo} from "graphql";
${namespace.replace(/^\s+$/mg, '')}`;
    }
    /**
     * Render a list of type (i.e. interfaces)
     * @param types
     * @returns
     */
    renderTypes(types) {
        return types
            .filter((type) => !this.introspectionTypes[type.name])
            .filter((type) => type.kind === 'OBJECT')
            .map((type) => this.renderTypeDef(type, types))
            .join('\n\n');
    }
    /**
     * Render a Type (i.e. an interface)
     * @param type
     * @returns
     */
    renderTypeDef(type, all) {
        return renderTag_1.source `
${this.renderComment(type.description)}
export interface ${type.name}<Ctx> ${this.renderExtends(type)}{
    ${this.renderTypename(type.name, all)}${renderTag_1.OMIT_NEXT_NEWLINE}
${type.fields.map((field) => this.renderMemberWithComment(field, type.name)).join('\n')}
}
`;
    }
    /**
     * Renders a __typename constant if the type is used in a union or interface.
     * @param forType
     * @param all
     */
    renderTypename(forType, all) {
        const usedBy = all
            .filter((type) => !this.introspectionTypes[type.name])
            .filter((type) => type.kind === 'UNION' || type.kind === 'INTERFACE')
            .filter((type) => type.possibleTypes.filter((cand) => cand.name === forType).length > 0);
        if (usedBy.length === 0) {
            return '';
        }
        return `__typename: '${forType}'\n`;
    }
    /**
     * Renders the extends clause of an interface (e.g. 'extends A, B. C').
     * @param type
     * @returns
     */
    renderExtends(type) {
        if (type.interfaces && type.interfaces.length > 0) {
            const interfaces = type.interfaces.map((it) => `${it.name}<Ctx>`).join(', ');
            return `extends ${interfaces} `;
        }
        else {
            return '';
        }
    }
    /**
     * Render a member (field or method) and its doc-comment
     * @param field
     * @param parentTypeName
     * @returns
     */
    renderMemberWithComment(field, parentTypeName) {
        return renderTag_1.source `
${this.renderComment(field.description)}
${this.renderMember(field, parentTypeName)}
`;
    }
    /**
     * Render a single field or method without doc-comment
     * @param field
     * @param parentTypeName
     * @returns {string}
     */
    renderMember(field, parentTypeName) {
        const optional = field.type.kind !== 'NON_NULL';
        const type = this.renderType(field.type, false);
        const resultType = optional ? `${type} | undefined` : type;
        const argType = field.args.length ? `${field.name}Args` : this.renderArgumentType(field.args || []);
        const name = optional ? field.name + '?' : field.name;
        const source = parentTypeName ? parentTypeName + '<Ctx>' : 'undefined';
        return `${name}: GraphqlField<${source}, ${argType}, ${resultType}, Ctx>`;
    }
    /**
     * Render a single return type (or field type)
     * This function creates the base type that is then used as generic to a promise
     */
    renderType(type, optional) {
        function maybeOptional(arg) {
            return optional ? `(${arg} | undefined)` : arg;
        }
        function generic(arg) {
            return `${arg}<Ctx>`;
        }
        switch (type.kind) {
            case 'SCALAR':
                return maybeOptional(scalars[type.name]);
            case 'ENUM':
            case 'INPUT_OBJECT':
                return maybeOptional(type.name);
            case 'OBJECT':
            case 'UNION':
            case 'INTERFACE':
                return maybeOptional(generic(type.name));
            case 'LIST':
                return maybeOptional(`${this.renderType(type.ofType, true)}[]`);
            case 'NON_NULL':
                return this.renderType(type.ofType, false);
        }
    }
    /**
     * Render a description as doc-comment
     */
    renderComment(description) {
        if (!description) {
            // Parsed by the `source` tag-function to remove the next newline
            return renderTag_1.OMIT_NEXT_NEWLINE;
        }
        return `/**\n * ` + description.split('\n').join(`\n * `) + `\n */`;
    }
    /**
     * Render the arguments of a function
     */
    renderArgumentType(args) {
        const base = args.map((arg) => {
            return `${arg.name}: ${this.renderType(arg.type, false)}`;
        }).join(', ');
        return `{${base}}`;
    }
    /**
     * Render a list of enums.
     * @param types
     * @returns
     */
    renderEnums(types) {
        return types
            .filter((type) => !this.introspectionTypes[type.name])
            .filter((type) => type.kind === 'ENUM')
            .map((type) => this.renderEnum(type))
            .join('\n');
    }
    /**
     * Render an Enum.
     * @param type
     * @returns
     */
    renderEnum(type) {
        return renderTag_1.source `
${this.renderComment(type.description)}
export type ${type.name} = ${type.enumValues.map((value) => `'${value.name}'`).join(' | ')}
export const ${type.name}: { ${type.enumValues.map((value) => this.renderEnumValueType(value)).join(' ')} } = { ${type.enumValues.map((value) => this.renderEnumValue(value)).join(' ')}}`;
    }
    /**
     * Renders a type definition for an enum value.
     */
    renderEnumValueType(value) {
        return renderTag_1.source `
${value.name}: '${value.name}',
`;
    }
    /**
     * Renders a the definition of an enum value.
     */
    renderEnumValue(value) {
        return renderTag_1.source `
${this.renderComment(value.description)}
${value.name}: '${value.name}',
`;
    }
    /**
     * Render a list of unions.
     * @param types
     * @returns
     */
    renderUnions(types) {
        return types
            .filter((type) => !this.introspectionTypes[type.name])
            .filter((type) => type.kind === 'UNION')
            .map((type) => this.renderUnion(type))
            .join('\n');
    }
    /**
     * Render a union.
     * @param type
     * @returns
     */
    renderUnion(type) {
        // Scalars cannot be used in unions, so we're safe here
        const unionValues = type.possibleTypes.map(type => `${type.name}<Ctx>`).join(' | ');
        return renderTag_1.source `
${this.renderComment(type.description)}
export type ${type.name}<Ctx> = ${unionValues}

`;
    }
    /**
     * Render a list of interfaces.
     * @param types
     * @returns
     */
    renderInterfaces(types) {
        return types
            .filter((type) => !this.introspectionTypes[type.name])
            .filter((type) => type.kind === 'INTERFACE')
            .map((type) => this.renderInterface(type))
            .join('\n');
    }
    /**
     * Render an interface.
     * @param type
     * @returns
     */
    renderInterface(type) {
        return renderTag_1.source `
${this.renderComment(type.description)}
export interface ${type.name}<Ctx> {
    ${type.fields.map((field) => this.renderMemberWithComment(field, type.name)).join('\n')}
}
`;
    }
    renderArguments(types) {
        return types
            .filter(type => !this.introspectionTypes[type.name])
            .filter(type => type.name === 'Mutation' || type.name === 'Query' || type.name === 'Subscription')
            .map(type => type.fields)
            .reduce((memo, fields) => memo.concat(fields), [])
            .map((type) => renderInputsInterfaces(type, types))
            .join('');
        function renderInputsInterfaces(type, all) {
            return (`
export interface ${type.name}Args {
${type.args.map(renderArg).join('\n')}
}
`);
        }
        function renderArg(arg) {
            const optional = arg.type.kind === 'NON_NULL' ? '' : '?';
            const type = arg.type.ofType ? arg.type.ofType.name : arg.type.name;
            return `    ${arg.name}${optional}: ${type}`;
        }
    }
    /**
     * Render a list of input object.
     * @param types
     * @returns
     */
    renderInputObjects(types) {
        return types
            .filter((type) => !this.introspectionTypes[type.name])
            .filter((type) => type.kind === 'INPUT_OBJECT')
            .map((type) => this.renderInputObject(type))
            .join('\n');
    }
    /**
     * Render an input object.
     * @param type
     * @returns
     */
    renderInputObject(type) {
        return renderTag_1.source `
${this.renderComment(type.description)}
export interface ${type.name} {
    ${type.inputFields.map((field) => this.renderInputMemberWithComment(field)).join('\n')}
}
`;
    }
    /**
     * Render a input member (field or method) and its doc-comment
     * @param field
     * @returns
     */
    renderInputMemberWithComment(field) {
        return renderTag_1.source `
${this.renderComment(field.description)}
${this.renderInputMember(field)}
`;
    }
    /**
     * Render a single input field or method without doc-comment
     * @param field
     * @returns {string}
     */
    renderInputMember(field) {
        const type = this.renderType(field.type, false);
        // Render property as field, with the option of being of a function-type () => ReturnValue
        const optional = field.type.kind !== 'NON_NULL';
        const name = optional ? field.name + '?' : field.name;
        return `${name}: ${type}`;
    }
    /**
     * Render a default resolver that implements resolveType for all unions and interfaces.
     * @param types
     * @return string
     */
    renderDefaultResolvers(types) {
        const resolvers = types
            .filter((type) => !this.introspectionTypes[type.name])
            .filter((type) => type.kind === 'UNION' || type.kind === 'INTERFACE')
            .map((type) => this.renderResolver(type))
            .join(',\n');
        return renderTag_1.source `\n
export const defaultResolvers = {
${resolvers}
};`;
    }
    /**
     * Renders a single resolver.
     *
     * @param type
     * @return string
     */
    renderResolver(type) {
        return renderTag_1.source `
    ${type.name}: {
        __resolveType(obj) {
            return obj.__typename
        }
    }`;
    }
}
exports.Renderer = Renderer;
const scalars = {
    'String': 'string',
    'Int': 'number',
    'Float': 'number',
    'Boolean': 'boolean',
    'ID': 'string'
};
/**
 * Covert an array of strings into an object in which each string is a key with value 'true'
 * @param array
 * @returns {{}}
 */
function setOf(array) {
    return array.reduce((set, current) => {
        set[current] = true;
        return set;
    }, {});
}
//# sourceMappingURL=render.js.map
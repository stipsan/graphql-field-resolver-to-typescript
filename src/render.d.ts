import { Root, TypeDef, Field, Argument, EnumValue, InputField } from './model';
import { OMIT_NEXT_NEWLINE } from './renderTag';
export interface Options {
    tslint?: Object;
}
export declare class Renderer {
    private options;
    /**
     * Types that are not created as interface, because they are part of the introspection
     */
    private introspectionTypes;
    constructor(options: Options);
    /**
     * Render the whole schema as interface
     * @param root
     * @returns {string}
     */
    render(root: Root): string;
    /**
     * Render a list of type (i.e. interfaces)
     * @param types
     * @returns
     */
    renderTypes(types: TypeDef[]): string;
    /**
     * Render a Type (i.e. an interface)
     * @param type
     * @returns
     */
    renderTypeDef(type: TypeDef, all: TypeDef[]): string;
    /**
     * Renders a __typename constant if the type is used in a union or interface.
     * @param forType
     * @param all
     */
    renderTypename(forType: string, all: TypeDef[]): string;
    /**
     * Renders the extends clause of an interface (e.g. 'extends A, B. C').
     * @param type
     * @returns
     */
    renderExtends(type: TypeDef): string;
    /**
     * Render a member (field or method) and its doc-comment
     * @param field
     * @param parentTypeName
     * @returns
     */
    renderMemberWithComment(field: Field, parentTypeName: string): string;
    /**
     * Render a single field or method without doc-comment
     * @param field
     * @param parentTypeName
     * @returns {string}
     */
    renderMember(field: Field, parentTypeName: string): string;
    /**
     * Render a single return type (or field type)
     * This function creates the base type that is then used as generic to a promise
     */
    renderType(type: any, optional: boolean): any;
    /**
     * Render a description as doc-comment
     */
    renderComment(description: string): string | typeof OMIT_NEXT_NEWLINE;
    /**
     * Render the arguments of a function
     */
    renderArgumentType(args: Argument[]): string;
    /**
     * Render a list of enums.
     * @param types
     * @returns
     */
    renderEnums(types: TypeDef[]): string;
    /**
     * Render an Enum.
     * @param type
     * @returns
     */
    renderEnum(type: TypeDef): string;
    /**
     * Renders a type definition for an enum value.
     */
    renderEnumValueType(value: EnumValue): string;
    /**
     * Renders a the definition of an enum value.
     */
    renderEnumValue(value: EnumValue): string;
    /**
     * Render a list of unions.
     * @param types
     * @returns
     */
    renderUnions(types: TypeDef[]): string;
    /**
     * Render a union.
     * @param type
     * @returns
     */
    renderUnion(type: TypeDef): string;
    /**
     * Render a list of interfaces.
     * @param types
     * @returns
     */
    renderInterfaces(types: TypeDef[]): string;
    /**
     * Render an interface.
     * @param type
     * @returns
     */
    renderInterface(type: TypeDef): string;
    renderArguments(types: any): any;
    /**
     * Render a list of input object.
     * @param types
     * @returns
     */
    renderInputObjects(types: TypeDef[]): string;
    /**
     * Render an input object.
     * @param type
     * @returns
     */
    renderInputObject(type: TypeDef): string;
    /**
     * Render a input member (field or method) and its doc-comment
     * @param field
     * @returns
     */
    renderInputMemberWithComment(field: InputField): string;
    /**
     * Render a single input field or method without doc-comment
     * @param field
     * @returns {string}
     */
    renderInputMember(field: InputField): string;
    /**
     * Render a default resolver that implements resolveType for all unions and interfaces.
     * @param types
     * @return string
     */
    renderDefaultResolvers(types: TypeDef[]): string;
    /**
     * Renders a single resolver.
     *
     * @param type
     * @return string
     */
    renderResolver(type: TypeDef): string;
}

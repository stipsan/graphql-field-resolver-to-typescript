export interface Root {
    data: {
        __schema: {
            types: TypeDef[];
        };
    };
}
export declare type Kind = 'SCALAR' | 'OBJECT' | 'NON_NULL' | 'LIST' | 'ENUM' | 'UNION' | 'INTERFACE' | 'INPUT_OBJECT';
/**
 * Model definition of the introspection result
 */
export interface TypeDef {
    name: string;
    kind: Kind;
    description: string;
    fields?: Field[];
    enumValues?: EnumValue[];
    possibleTypes?: Type[];
    interfaces?: Type[];
    inputFields: InputField[];
}
export declare class Field {
    name: string;
    description: string;
    args: Argument[];
    type: Type;
    isDeprecated: boolean;
    deprecationReason: string;
}
export declare class InputField {
    name: string;
    description: string;
    type: Type;
    defaultValue: any;
}
export declare class Argument {
    name: string;
    description: string;
    type: Type;
    defaultValue: string;
}
export declare class Type {
    kind: Kind;
    name: string;
    ofType: Type;
}
export declare class EnumValue {
    name: string;
    description: string;
    deprecated: boolean;
    deprecationReason?: string;
}

export declare namespace schema {
    type GraphqlField<Args, Result, Ctx> = Result | Promise<Result> | ((args: Args, context: Ctx) => Result | Promise<Result>);
    /**
     * A character
     */
    interface Character<Ctx> {
        id: GraphqlField<{}, string, Ctx>;
        name: GraphqlField<{}, string, Ctx>;
    }
    interface Functional<Ctx> {
        primaryFunction?: GraphqlField<{}, string | undefined, Ctx>;
    }
    interface Query<Ctx> {
        characters?: GraphqlField<{}, (Character<Ctx> | undefined)[] | undefined, Ctx>;
    }
    interface Human<Ctx> extends Character<Ctx> {
        __typename: 'Human';
        id: GraphqlField<{}, string, Ctx>;
        name: GraphqlField<{}, string, Ctx>;
        friends?: GraphqlField<{}, (Character<Ctx> | undefined)[] | undefined, Ctx>;
    }
    interface Droid<Ctx> extends Character<Ctx>, Functional<Ctx> {
        __typename: 'Droid';
        id: GraphqlField<{}, string, Ctx>;
        name: GraphqlField<{}, string, Ctx>;
        primaryFunction?: GraphqlField<{}, string | undefined, Ctx>;
    }
    const defaultResolvers: {
        Character: {
            __resolveType(obj: any): any;
        };
        Functional: {
            __resolveType(obj: any): any;
        };
    };
}

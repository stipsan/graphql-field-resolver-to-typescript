export declare namespace schema {
    type GraphqlField<Args, Result, Ctx> = Result | Promise<Result> | ((args: Args, context: Ctx) => Result | Promise<Result>);
    interface Query<Ctx> {
        /**
         * A field description
         */
        field1?: GraphqlField<{}, TypeA<Ctx> | undefined, Ctx>;
        /**
         * Another field description
         */
        field2?: GraphqlField<{}, TypeB<Ctx> | undefined, Ctx>;
    }
    /**
     * A simple type
     * Multiline description
     */
    interface TypeA<Ctx> {
        name?: GraphqlField<{}, string | undefined, Ctx>;
        size?: GraphqlField<{}, number | undefined, Ctx>;
    }
    /**
     * Another more complex type
     */
    interface TypeB<Ctx> {
        nested?: GraphqlField<{}, (TypeA<Ctx> | undefined)[] | undefined, Ctx>;
    }
    const defaultResolvers: {};
}

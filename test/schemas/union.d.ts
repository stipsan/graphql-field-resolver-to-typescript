export declare namespace schema {
    type GraphqlField<Args, Result, Ctx> = Result | Promise<Result> | ((args: Args, context: Ctx) => Result | Promise<Result>);
    type Single<Ctx> = A<Ctx>;
    /**
     * A or B
     */
    type AOrB<Ctx> = A<Ctx> | B<Ctx>;
    interface Query<Ctx> {
        single?: GraphqlField<{}, Single<Ctx> | undefined, Ctx>;
        aOrB?: GraphqlField<{
            a: number;
        }, AOrB<Ctx> | undefined, Ctx>;
    }
    interface A<Ctx> {
        __typename: 'A';
        aName?: GraphqlField<{}, string | undefined, Ctx>;
    }
    interface B<Ctx> {
        __typename: 'B';
        bName?: GraphqlField<{}, string | undefined, Ctx>;
    }
    const defaultResolvers: {
        Single: {
            __resolveType(obj: any): any;
        };
        AOrB: {
            __resolveType(obj: any): any;
        };
    };
}

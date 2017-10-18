export declare namespace schema {
    type GraphqlField<Args, Result, Ctx> = Result | Promise<Result> | ((args: Args, context: Ctx) => Result | Promise<Result>);
    type STATE = 'OPEN' | 'CLOSED' | 'DELETED';
    const STATE: {
        OPEN: 'OPEN';
        CLOSED: 'CLOSED';
        DELETED: 'DELETED';
    };
    interface Query<Ctx> {
        state: GraphqlField<{}, STATE, Ctx>;
        optionalState?: GraphqlField<{}, STATE | undefined, Ctx>;
    }
    const defaultResolvers: {};
}

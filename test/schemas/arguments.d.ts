export declare namespace schema {
    type GraphqlField<Args, Result, Ctx> = Result | Promise<Result> | ((args: Args, context: Ctx) => Result | Promise<Result>);
    interface Query<Ctx> {
        field1?: GraphqlField<{
            a: string;
            b: number;
        }, string | undefined, Ctx>;
    }
    const defaultResolvers: {};
}

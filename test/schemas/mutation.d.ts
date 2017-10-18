export declare namespace schema {
    type GraphqlField<Args, Result, Ctx> = Result | Promise<Result> | ((args: Args, context: Ctx) => Result | Promise<Result>);
    /**
     * Set a key to a value
     */
    interface SetValueCommand {
        key: string;
        value?: string;
    }
    interface Query<Ctx> {
        values?: GraphqlField<{}, (KeyValue<Ctx> | undefined)[] | undefined, Ctx>;
    }
    interface KeyValue<Ctx> {
        key: GraphqlField<{}, string, Ctx>;
        value?: GraphqlField<{}, string | undefined, Ctx>;
    }
    interface Mutation<Ctx> {
        simpleMutation?: GraphqlField<{
            key: string;
            value: string;
        }, (KeyValue<Ctx> | undefined)[] | undefined, Ctx>;
        commandMutation?: GraphqlField<{
            cmd: SetValueCommand;
        }, (KeyValue<Ctx> | undefined)[] | undefined, Ctx>;
    }
    const defaultResolvers: {};
}

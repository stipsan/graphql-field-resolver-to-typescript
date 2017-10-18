"use strict";
/*!
 * gql2ts-for-server <https://github.com/nknapp/gql2ts-for-server>
 *
 * Copyright (c) 2016 Nils Knappmeier.
 * Released under the MIT license.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global describe */
// /* global it */
// /* global xdescribe */
// /* global xit */
const path = require("path");
const fs = require("fs");
const chai_1 = require("chai");
const graphql_1 = require("graphql");
const graphql_tools_1 = require("graphql-tools");
const union_1 = require("./schemas/union");
const interface_1 = require("./schemas/interface");
function fixture(filename) {
    return path.join(__dirname, 'schemas', filename);
}
function read(file) {
    return fs.readFileSync(file, { encoding: 'utf-8' });
}
describe('The simple schema', function () {
    // Automatic generation of tests from the testcases-directory
    it('should be possible to use with graphql', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = graphql_1.buildSchema(read(fixture('simpleSchema.graphqls')));
            const root = {
                field1: {
                    name: 'abc',
                    size: () => 4
                },
                field2: Promise.resolve({
                    nested: [
                        {
                            name: () => 'cde',
                            size: () => Promise.resolve(3)
                        }
                    ]
                })
            };
            const result = yield graphql_1.graphql(schema, `{
                field1 {
                    name
                    size
                }
                field2 {
                    nested {
                        name
                        size
                    }
                }
            }`, root);
            chai_1.expect(result, 'Checking simple schema result').to.deep.equal({
                data: {
                    field1: {
                        name: 'abc',
                        size: 4
                    },
                    field2: {
                        nested: [{
                                name: 'cde',
                                size: 3
                            }]
                    }
                }
            });
        });
    });
});
describe('The arguments schema', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = graphql_1.buildSchema(read(fixture('arguments.graphqls')));
        const root = {
            field1: (args) => {
                return args.a + ' ' + args.b;
            }
        };
        it('Test with default argument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield graphql_1.graphql(schema, `{
                field1(a:"b")
            }`, root);
                chai_1.expect(result, 'Checking arguments-schema with default argument').to.deep.equal({
                    data: {
                        field1: 'b 3'
                    }
                });
            });
        });
        it('Test with explicit argument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield graphql_1.graphql(schema, `{
                field1(a:"b",b:4)
            }`, root);
                chai_1.expect(result, 'Checking arguments-schema with default argument').to.deep.equal({
                    data: {
                        field1: 'b 4'
                    }
                });
            });
        });
    });
});
describe('The union schema (with graphql-tools)', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = graphql_tools_1.makeExecutableSchema({
            typeDefs: read(fixture('union.graphqls')),
            resolvers: union_1.schema.defaultResolvers
        });
        const root = new class Query {
            single() {
                return {
                    __typename: 'A',
                    aName: 'Hi there!'
                };
            }
            aOrB(args) {
                if (args.a % 2 === 0) {
                    return {
                        __typename: 'A',
                        aName: 'This is A'
                    };
                }
                else {
                    return {
                        __typename: 'B',
                        bName: 'This is B'
                    };
                }
            }
        }();
        it('Test with single value union', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield graphql_1.graphql(schema, `{
                single { ... on A { aName } }
            }`, root);
                chai_1.expect(result, 'Checking union-schema with single value').to.deep.equal({
                    data: {
                        single: {
                            aName: 'Hi there!'
                        }
                    }
                });
            });
        });
        it('Test with multi value union to A', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield graphql_1.graphql(schema, `{
                aOrB(a: 0) { ... on A { aName } ... on B { bName } }
            }`, root);
                chai_1.expect(result, 'Checking union-schema with multi value (A)').to.deep.equal({
                    data: {
                        aOrB: {
                            aName: 'This is A'
                        }
                    }
                });
            });
        });
        it('Test with multi value union to B', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield graphql_1.graphql(schema, `{
                aOrB(a: 1) { ... on A { aName } ... on B { bName } }
            }`, root);
                chai_1.expect(result, 'Checking union-schema with multi value (B)').to.deep.equal({
                    data: {
                        aOrB: {
                            bName: 'This is B'
                        }
                    }
                });
            });
        });
    });
});
describe('The interface schema (with graphql-tools)', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = graphql_tools_1.makeExecutableSchema({
            typeDefs: read(fixture('interface.graphqls')),
            resolvers: interface_1.schema.defaultResolvers
        });
        const root = new class Query {
            characters() {
                return [
                    {
                        __typename: 'Human',
                        id: '1',
                        name: 'Hans',
                        friends: [{
                                __typename: 'Human',
                                id: '2',
                                name: 'Marry',
                                friends: []
                            }, {
                                __typename: 'Droid',
                                id: '3',
                                name: 'Mr Robot',
                                primaryFunction: 'music'
                            }]
                    }
                ];
            }
        }();
        it('Test with array', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield graphql_1.graphql(schema, `{
                characters {
                    ... on Human {
                        name
                        friends {
                            ... on Human { name }
                            ... on Droid { name, primaryFunction }
                        }
                    }
                    ... on Droid {
                        name
                    }
                }
            }`, root);
                chai_1.expect(result, 'Checking union-schema with single value').to.deep.equal({
                    data: {
                        characters: [{
                                name: 'Hans',
                                friends: [{
                                        name: 'Marry'
                                    }, {
                                        name: 'Mr Robot',
                                        primaryFunction: 'music'
                                    }]
                            }]
                    }
                });
            });
        });
    });
});
//# sourceMappingURL=usability-spec.js.map
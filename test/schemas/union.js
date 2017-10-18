"use strict";
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
var schema;
(function (schema) {
    schema.defaultResolvers = {
        Single: {
            __resolveType(obj) {
                return obj.__typename;
            }
        },
        AOrB: {
            __resolveType(obj) {
                return obj.__typename;
            }
        }
    };
})(schema = exports.schema || (exports.schema = {}));
//# sourceMappingURL=union.js.map
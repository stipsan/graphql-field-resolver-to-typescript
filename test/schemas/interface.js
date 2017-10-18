"use strict";
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
var schema;
(function (schema) {
    schema.defaultResolvers = {
        Character: {
            __resolveType(obj) {
                return obj.__typename;
            }
        },
        Functional: {
            __resolveType(obj) {
                return obj.__typename;
            }
        }
    };
})(schema = exports.schema || (exports.schema = {}));
//# sourceMappingURL=interface.js.map
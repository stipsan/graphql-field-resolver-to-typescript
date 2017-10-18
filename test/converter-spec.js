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
const index_1 = require("../src/index");
const path = require("path");
const fs = require("fs");
const chai_1 = require("chai");
const converter = new index_1.Converter();
function fixture(filename) {
    return path.join(__dirname, 'schemas', filename);
}
function store(file, code) {
    return fs.writeFileSync(file, code);
}
function read(file) {
    return fs.readFileSync(file, { encoding: 'utf-8' }).trim();
}
describe('gql2ts-for-server:', function () {
    // Automatic generation of tests from the testcases-directory
    fs.readdirSync(path.join(__dirname, 'schemas'))
        .filter((file) => file.match(/\.graphqls$/))
        .forEach((file) => {
        it(`should handle ${file} correctly`, function () {
            return __awaiter(this, void 0, void 0, function* () {
                const source = fixture(file);
                // The naming scheme of test fixtures is intentionally
                // different from the naming schema of the executable
                // The executable converts a.graphql to a.graphql.types.ts
                // and the test-fixture is "a.ts"
                // We don't want test fixture generated by accidentally
                // running 'graphql-typewriter' in the project dir
                // That would always make the test pass...
                const target = source.replace(/\.graphqls$/, '.ts');
                const result = yield converter.convert(read(source));
                // If the target file does not exist yet, we write it
                // with a short disclaimer, so that the test does not pass
                if (!fs.existsSync(target)) {
                    store(target, `// Please check this result\n${result}`);
                }
                chai_1.expect(result).to.equal(read(target));
            });
        });
    });
});
//# sourceMappingURL=converter-spec.js.map
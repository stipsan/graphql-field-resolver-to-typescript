"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const index_1 = require("./index");
// Import via ES 5, node-style 'require', because there are no typings for this file (yet)
const mfs = require('m-io/fs');
function runCli(cliArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remove default value from 'exclude', if explicit values have been provided
        if (cliArgs.exclude.length > 1) {
            cliArgs.exclude.shift();
        }
        let files;
        if (cliArgs.input.length > 0) {
            files = cliArgs.input;
        }
        else {
            files = glob.sync('**/*.graphqls', {
                ignore: cliArgs.exclude
            });
        }
        const converter = new index_1.Converter();
        const promises = files.map((sourceFile) => __awaiter(this, void 0, void 0, function* () {
            const targetFile = sourceFile + '.types.ts';
            try {
                const source = yield mfs.read(sourceFile, { encoding: 'utf-8' });
                const ts = yield converter.convert(source);
                if (cliArgs.dontSaveSameFile) {
                    const oldContents = yield mfs.read(targetFile);
                    if (oldContents === ts) {
                        console.log(`${sourceFile} -> ${targetFile}`, 'success');
                        return;
                    }
                }
                yield mfs.write(targetFile, ts);
                console.log(`${sourceFile} -> ${targetFile}`, 'success');
            }
            catch (e) {
                console.log(`${sourceFile} -> ${targetFile}`, e);
            }
        }));
        return Promise.all(promises);
    });
}
exports.runCli = runCli;
//# sourceMappingURL=runCli.js.map
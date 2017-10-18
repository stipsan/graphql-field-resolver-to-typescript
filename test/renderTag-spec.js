"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderTag_1 = require("../src/renderTag");
const chai_1 = require("chai");
describe('The renderTag function', function () {
    it('should render simple template literals like the default template literal', function () {
        chai_1.expect(renderTag_1.source `ein ${'einfacher'} string ${2}`).to.equal('ein einfacher string 2');
    });
    it('should skip the first and the last newline of the result', function () {
        chai_1.expect(renderTag_1.source `\nein ${'einfacher'} string ${2}\n`).to.equal('ein einfacher string 2');
    });
    it('should skip no more than the first and the last newline of the result', function () {
        chai_1.expect(renderTag_1.source `\n\nein ${'einfacher'} string ${2}\n\n`).to.equal('\nein einfacher string 2\n');
    });
    it('should indent multiline replacements with the indent of the substitution', function () {
        chai_1.expect(renderTag_1.source `abc\n   ${'multiline\nsubstitution'}`).to.equal('abc\n   multiline\n   substitution');
    });
    it('should omit whitespace and the next newline after a OMIT_NEXT_NEWLINE substitution', function () {
        chai_1.expect(renderTag_1.source `abc${renderTag_1.OMIT_NEXT_NEWLINE}   \nabc`).to.equal('abcabc');
    });
});
//# sourceMappingURL=renderTag-spec.js.map
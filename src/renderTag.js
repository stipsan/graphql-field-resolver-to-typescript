"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spaces = '                                                                                       ';
/**
 * Token that removes whitespace following the substition up to and including the next newline character
 * @type {{action: string}}
 */
exports.OMIT_NEXT_NEWLINE = {
    action: 'omit next newline'
};
/**
 * Tag function for the template strings in this class.
 * Removes the first and last character, if it is a newline
 * and expands the current indent on multiline substitions
 * @see http://exploringjs.com/es6/ch_template-literals.html
 * @param array the input array
 * @param a1 string substitution
 * @param a2 string substitution
 * @param a2 string substitution
 * @param a3 string substitution
 * @param a4 string substitution
 * @param a5 string substitution
 * @param a6 string substitution
 * @param a7 string substitution
 */
function source(array, a1, a2, a3, a4, a5, a6, a7 /* dynamic args */) {
    const args = Array.prototype.slice.call(arguments, 1);
    let result = array[0];
    for (let i = 0; i < args.length; i++) {
        // Determine indent
        const indent = result.length - result.lastIndexOf('\n') - 1;
        switch (args[i]) {
            case exports.OMIT_NEXT_NEWLINE:
                result += array[i + 1].replace(/^ *\n/, '');
                break;
            default:
                result += String(args[i]).replace(/\n/g, '\n' + spaces.slice(0, indent));
                result += array[i + 1];
        }
    }
    return result.replace(/(^\n|\n$)/g, '');
}
exports.source = source;
//# sourceMappingURL=renderTag.js.map
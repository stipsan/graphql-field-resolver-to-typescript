/**
 * Token that removes whitespace following the substition up to and including the next newline character
 * @type {{action: string}}
 */
export declare const OMIT_NEXT_NEWLINE: {
    action: string;
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
export declare function source(array: any, a1: any, a2?: any, a3?: any, a4?: any, a5?: any, a6?: any, a7?: any): any;

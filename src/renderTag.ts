// @TODO probably possible to replace this with prettier

const spaces =
  '                                                                                       '

/**
 * Token that removes whitespace following the substition up to and including the next newline character
 * @type {{action: string}}
 */
export const OMIT_NEXT_NEWLINE = {
  action: 'omit next newline',
}

/**
 * Tag function for the template strings in this class.
 * Removes the first and last character, if it is a newline
 * and expands the current indent on multiline substitions
 */
export function source(array: TemplateStringsArray, ...args: any[]) {
  let result = array[0]
  for (let i = 0; i < args.length; i++) {
    // Determine indent
    const indent = result.length - result.lastIndexOf('\n') - 1
    switch (args[i]) {
      case OMIT_NEXT_NEWLINE:
        result += array[i + 1].replace(/^ *\n/, '')
        break
      default:
        result += String(args[i]).replace(/\n/g, '\n' + spaces.slice(0, indent))
        result += array[i + 1]
    }
  }
  return result.replace(/(^\n|\n$)/g, '')
}

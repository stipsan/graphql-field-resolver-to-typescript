#!/usr/bin/env node

import { runCli } from './runCli'
import * as meow from 'meow'

const cli = meow(
  [
    'Usage:',
    '  $ gqlfr2ts [<input> ...]',
    '',
    'Options:',
    '  --output, -o path  Specifies the name and location of the output file. If not specified, stdout is used.',
    '',
    'Examples:',
    '  $ gqlfr2ts schema.graphql',
    '    Processes the file schema.graphql and prints to stdout',
    '  $ cat schema.graphql | gqlfr2ts --output schema.d.ts',
    '    Processes the input from stdin and writes output to schema.d.ts',
    '  $ gqlfr2ts RootQuery.graphql User.graphql --output schema.d.ts',
    '    Stitch a schema together and output a complete typescript definition for all the related resolvers',
    '  $ cat **/*.graphql | gqlfr2ts > schema.d.ts',
    '    Stitch a schema together from stdin and pipe it to stdout and use the shell to write output to file.',
    '    This is the fastest way to do it when you have a lot of files that combine to a big schema.',
  ],
  {
    string: ['output'],
    alias: { o: 'output', h: 'help' },
  }
)

// most amazing trick ever, since node don't allow `await` on the top level 😜
const run = async () => {
  if (cli.input.length === 0 && !cli.flags.stdin) {
    // check if it is needed to show an error
    process.stderr.write('\nNo input specified.\n')
    cli.showHelp()
  }

  // if input is specified use that and ignore stdin

  // use stdin

  // if neither, show error

  // proceed with script using input

  // if no -output is specified, output with console.log

  // if output is set, write to file
}

// fire away!
run()

import { Converter } from '..'
import * as path from 'path'
import * as fs from 'fs'

const converter = new Converter()

function fixture(filename) {
  return path.join(__dirname, 'schemas', filename)
}
function store(file, code) {
  return fs.writeFileSync(file, code)
}

function read(file) {
  return fs.readFileSync(file, { encoding: 'utf-8' }).trim()
}

// Automatic generation of tests from the testcases-directory
fs
  .readdirSync(path.join(__dirname, 'schemas'))
  .filter(file => file.match(/\.graphql$/))
  .forEach(file => {
    it(`should handle ${file} correctly`, async function() {
      const source = fixture(file)
      const result = await converter.convert(read(source))
      expect(result).toMatchSnapshot()
    })
  })

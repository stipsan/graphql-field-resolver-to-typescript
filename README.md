# graphql-field-resolver-to-typescript &middot; [![CircleCI Status](https://img.shields.io/circleci/project/github/stipsan/graphql-field-resolver-to-typescript.svg?style=flat-square&label=circleci)](https://circleci.com/gh/stipsan/graphql-field-resolver-to-typescript) [![npm version](https://img.shields.io/npm/v/graphql-field-resolver-to-typescript.svg?style=flat-square)](https://www.npmjs.com/package/graphql-field-resolver-to-typescript) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> This project started its life as a fork of [graphql-typewriter](https://www.npmjs.com/package/graphql-typewriter)

# Usage

## &nbsp;&nbsp;🚗 Local package.json
```bash
$ yarn add --dev graphql-field-resolver-to-typescript
$ gqlfr2ts **/*.graphql -o schema.d.ts
```

## &nbsp;🚙&nbsp; Global dependency
```bash
$ npm install -g graphql-field-resolver-to-typescript
$ gqlfr2ts **/*.graphql -o schema.d.ts
```

## 🏎💨&nbsp; Using [npx](https://github.com/zkat/npx#npx1----execute-npm-package-binaries)
```bash
$ npx graphql-field-resolver-to-typescript **/*.graphql -o schema.d.ts
```

# API
```bash
$ gqlfr2ts <input>
```

## `<input>`
You can provide a list over files or use stdin to pipe from other cli programs.

## `--output`, `-o` `path`
Optionally specify where to write the output. If not specified it'll pipe to stdout so you can pipe it to any cli program you want.

## Examples
  ```bash
$ gqlfr2ts schema.graphql
```
Processes the file schema.graphql and prints to stdout

```bash
$ cat schema.graphql | gqlfr2ts --output schema.d.ts
```
Processes the input from stdin and writes output to schema.d.ts
```bash
$ gqlfr2ts RootQuery.graphql User.graphql --output schema.d.ts
```
Stitch a schema together and output a complete typescript definition for all the related resolvers
```bash
$ cat **/*.graphql | gqlfr2ts > schema.d.ts
```
Stitch a schema together from stdin and pipe it to stdout and use the shell to write output to file.
This is the most performant solution when you have a lot of files that combine to a big schema.

## `.graphql` to `.ts` examples

### input
```graphql
type RootQuery {
  # A field description
  field1: TypeA
  # Another field description
  field2: TypeB
}

# A simple type
# Multiline description
type TypeA {
  name: String
  size: Int
}

# Another more complex type
type TypeB {
  nested: [TypeA]
}

schema {
  query: RootQuery
}
```

### output
```typescript
/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql'
type ID = string
export type GraphqlField<Source, Args, Result, Ctx> =
  | Result
  | Promise<Result>
  | ((
      source: Source,
      args: Args,
      context: Ctx,
      info: GraphQLResolveInfo
    ) => Result | Promise<Result>)

export interface RootQuery<Ctx> {
  /**
     * A field description
     */
  field1?: GraphqlField<RootQuery<Ctx>, {}, TypeA<Ctx> | undefined, Ctx>
  /**
     * Another field description
     */
  field2?: GraphqlField<RootQuery<Ctx>, {}, TypeB<Ctx> | undefined, Ctx>
}

/**
 * A simple type
 * Multiline description
 */
export interface TypeA<Ctx> {
  name?: GraphqlField<TypeA<Ctx>, {}, string | undefined, Ctx>
  size?: GraphqlField<TypeA<Ctx>, {}, number | undefined, Ctx>
}

/**
 * Another more complex type
 */
export interface TypeB<Ctx> {
  nested?: GraphqlField<
    TypeB<Ctx>,
    {},
    (TypeA<Ctx> | undefined)[] | undefined,
    Ctx
  >
}

export interface field1Args {}

export interface field2Args {}

export const defaultResolvers = {}
```

### usage in resolvers

```
@TODO this will come soon, this is a very young project and there's a lot of edge cases to iron out
```

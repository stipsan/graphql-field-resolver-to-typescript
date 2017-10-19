import {
  graphql,
  introspectionQuery,
  buildSchema,
  IntrospectionQuery,
  GraphQLError,
} from 'graphql'
import { format } from 'prettier'
import { Renderer } from './render'

interface ExecutionResult {
  data: IntrospectionQuery
  errors?: GraphQLError[]
}

export class Converter {
  public async convert(typeDefs: string): Promise<string> {
    const schema = buildSchema(typeDefs)
    const renderer = new Renderer({})
    const introSpection = (await graphql(
      schema,
      introspectionQuery,
      {}
    )) as ExecutionResult
    const result = await renderer.render(introSpection)
    return format(result, {
      parser: 'typescript',
      singleQuote: true,
      semi: false,
    })
  }
}

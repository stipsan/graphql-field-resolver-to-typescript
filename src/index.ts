import {
  graphql,
  introspectionQuery,
  buildSchema,
  IntrospectionQuery,
  GraphQLError,
} from 'graphql'
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
    return renderer.render(introSpection)
  }
}

import { graphql, introspectionQuery, buildSchema } from 'graphql'
import { Renderer } from './render'

export class Converter {
  public async convert(typeDefs: string): Promise<string> {
    const schema = buildSchema(typeDefs)
    const renderer = new Renderer({})
    const introSpection = await graphql(schema, introspectionQuery, {})
    return renderer.render(introSpection)
  }
}

import { ApolloServer, gql } from 'apollo-server-micro'
import cors from 'micro-cors'

import {
  MultiMatchQuery,
  CustomQuery,
  RefinementSelectFacet,
  RangeFacet,
  SearchkitSchema,
  DateRangeFacet,
  SearchkitResolver,
  GeoBoundingBoxFilter
} from '@searchkit/schema'

const searchkitConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'this_little_corner',
  hits: {
    fields: ['id','channel_id','title','description','url','date','transcript_parts']
  },
  sortOptions: [
    { id: 'newest', label: "Newest", field: [{"date": "desc"}], defaultOption: true},
    { id: 'oldest', label: "Oldest", field: [{"date": "asc"}]},
  ],
  query: new CustomQuery({
      queryFn: (query, qm) => {
        return {
          bool: {
            must: [
              {
                query_string: {
                  query: '"' + query + '"',
                  fields: ['title','description','transcript_full']
                }
              }
            ]
          }
        }
      }
    })
}

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  addToQueryType: true
})

export const config = {
  api: {
    bodyParser: false
  }
}

const server = new ApolloServer({
  typeDefs: [
    gql`
    type Query {
      root: String
    }
    
    type TranscriptPart {
      text: String,
      start: Float,
      duration: Float
    }

    type HitFields {
      id: String,
      channel_id: String,
      title: String,
      description: String,
      url: String,
      date: String,
      transcript_parts: [TranscriptPart]
    }

    type ResultHit implements SKHit {
      id: ID!
      fields: HitFields
      customField: String
    }

  `, ...typeDefs
  ],
  resolvers: withSearchkitResolvers({
    ResultHit: {
      customField: (parent) => `parent id ${parent.id}`
    }
  }),
  introspection: true,
  playground: true,
  context: {
    ...context
  }
})

const handler = server.createHandler({ path: '/api/graphql' })

export default cors()((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res))

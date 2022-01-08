import { ApolloServer, gql } from 'apollo-server-micro'
import cors from 'micro-cors'

import {
  MultiMatchQuery,
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
    { id: 'date', label: "Date", field: [{"date": "desc"}], defaultOption: true},
  ],
  query: new MultiMatchQuery({ fields: ['title','description','transcript_full'] }),
  facets: [
    new DateRangeFacet({
      field: 'date',
      identifier: 'date',
      label: 'Date'
    }),
  ]
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

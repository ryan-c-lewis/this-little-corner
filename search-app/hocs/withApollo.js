// lib/withApollo.js
import withApollo from 'next-with-apollo';
import { InMemoryCache, ApolloProvider, ApolloClient } from '@apollo/client'
import { Helmet } from 'react-helmet'

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: 'https://this-little-corner-searcher.ngrok.io/api/graphql',
      cache: new InMemoryCache().restore(initialState || {})
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <div>
            <Helmet>
                <title>This Little Corner Searcher</title>
            </Helmet>
            <ApolloProvider client={props.apollo}>
              <Page {...props} />
            </ApolloProvider>
        </div>
      );
    }
  }
);

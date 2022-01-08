// lib/withApollo.js
import withApollo from 'next-with-apollo';
import { InMemoryCache, ApolloProvider, ApolloClient } from '@apollo/client'

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: 'https://eda6-70-121-40-220.ngrok.io/api/graphql',
      cache: new InMemoryCache().restore(initialState || {})
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    }
  }
);

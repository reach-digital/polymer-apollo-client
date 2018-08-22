import ApolloClient, { getFragmentDefinitions, createFragmentMap } from 'apollo-client';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';

const errors = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`);
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const init = (config) => {
  if (!config) {
    console.error('Trying to initialize an ApolloClient without having a config set');
  }

  return new ApolloClient({
    link: new HttpLink(config),
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
  });
}

const namedClient = {};

export { init, gql, getFragmentDefinitions, createFragmentMap, namedClient };

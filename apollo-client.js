import ApolloClient, { getFragmentDefinitions, createFragmentMap, createBatchingNetworkInterface } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';

/**
 * @param config
 * @returns {ApolloClient}
 */
const init = (config) => {
  if (! config) {
    console.error('Trying to initialize an ApolloClient without having a config set');
  }

  // This should probably pull from the config object
  const httpLink = createHttpLink({ uri: '/graphql' });

  const inMemCache = new InMemoryCache().restore(window.__APOLLO_STATE__);

  // Create the apollo client
  return new ApolloClient({
    link: httpLink,
    cache: inMemCache
  });
}

const namedClient = {};

export { init, gql, getFragmentDefinitions, createFragmentMap, namedClient };

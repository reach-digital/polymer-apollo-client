import ApolloClient, { getFragmentDefinitions, createFragmentMap } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { BatchHttpLink } from "apollo-link-batch-http";
import gql from 'graphql-tag';

/**
 * @param config
 * @returns {ApolloClient}
 */
const init = (config) => {
  if (! config) {
    console.error('Trying to initialize an ApolloClient without having a config set');
  }

  // Create the apollo client
  return new ApolloClient({
    link: new BatchHttpLink(config),
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
  });
}

const namedClient = {};

export { init, gql, getFragmentDefinitions, createFragmentMap, namedClient };

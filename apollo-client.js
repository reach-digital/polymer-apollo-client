import ApolloClient, { getFragmentDefinitions, createFragmentMap, createBatchingNetworkInterface } from 'apollo-client';
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
    networkInterface: createBatchingNetworkInterface(Object.assign({batchInterval: 10, batchMax: 10}, config)),
    queryDeduplication: true
  });
}

const namedClient = {};

export { init, gql, getFragmentDefinitions, createFragmentMap, namedClient };

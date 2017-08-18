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

  const networkInterface = createBatchingNetworkInterface(Object.assign({batchInterval: 10, batchMax: 10}, config));

  const absintheAfterware = {
    applyBatchAfterware(res, next) {
      res.responses.forEach((resp) => {
        resp.data = resp.payload.data;
      });

      next();
    },
  };

  networkInterface.useAfter([absintheAfterware]);

  // Create the apollo client
  return new ApolloClient({
    networkInterface: networkInterface,
    queryDeduplication: true
  });
}

const namedClient = {};

export { init, gql, getFragmentDefinitions, createFragmentMap, namedClient };

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

  // const networkInterface = createBatchingNetworkInterface(Object.assign({batchInterval: 10, batchMax: 10}, config));

  // const absintheAfterware = {
  //   applyBatchAfterware(res, next) {
  //     res.responses.forEach((resp) => {
  //       resp.data = resp.payload.data;
  //     });

  //     next();
  //   },
  // };

    // networkInterface.useAfter([absintheAfterware]);

  const httpLink = createHttpLink({ uri: '/graphql' });

  // const absintheLink = new ApolloLink((operation, forward) => {
  //   return forward(operation).map((response) => {
  //     response.responses.forEach((resp) => {
  //       resp.data = resp.payload.data;
  //     });
  //     return response;
  //   });
  // });

  const link = absintheLink.concat(httpLink);

  // Create the apollo client
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  });
}

const namedClient = {};

export { init, gql, getFragmentDefinitions, createFragmentMap, namedClient };

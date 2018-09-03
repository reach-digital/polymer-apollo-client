import ApolloClient, { getFragmentDefinitions, createFragmentMap } from 'apollo-client';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { concat, split } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
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

const init = (config, wsConfig, apolloConfig) => {
  if (!config) {
    console.warn('Trying to initialize ApolloClient without config property, default config will be used.');
  } else if (!config.uri) {
    console.warn('Trying to initialize ApolloClient without config.uri property, default config.uri will be used.');
  }

  const httpLink = createUploadLink(config);

  let wsLink, splitLink;

  if (wsConfig) {
    wsLink = new WebSocketLink(wsConfig);
  }

  // Using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  if (httpLink && wsLink) {
    splitLink = split(
      // Split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      errors.concat(httpLink)
    );
  }

  const link = splitLink || wsLink || httpLink;

  const cache = new InMemoryCache().restore(window.__APOLLO_STATE__);

  const fullConfig = Object.assign({}, {
    link: link,
    cache: cache
  }, apolloConfig);

  return new ApolloClient(fullConfig);
}

const namedClient = {};

export { init, gql, getFragmentDefinitions, createFragmentMap, namedClient };

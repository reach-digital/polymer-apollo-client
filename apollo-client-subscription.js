import ApolloClient, { getFragmentDefinitions, createFragmentMap } from 'apollo-client';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, concat, split } from 'apollo-link';
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

const init = (config, wsConfig) => {
  if (!config && !wsConfig) {
    console.error('Trying to initialize an ApolloClient without having a config set');
  }

  let httpLink, wsLink, splitLink;

  if (config && /^http[s]{0,1}:/.test(config.uri)) {
    httpLink = new HttpLink(
      Object.assign({}, config.options, {
        uri: config.uri,
      })
    );
  }

  if (wsConfig && /^w[s]{1,2}:/.test(wsConfig.uri)) {
    wsLink = new WebSocketLink({
      uri: wsConfig.uri,
      options: wsConfig.options,
    });
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

  if (!link) {
    console.error('Trying to initialize an ApolloClient without having correct a config set');
  }

  return new ApolloClient({
    link: link,
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
  });
}

const namedClient = {};

export { init, gql, getFragmentDefinitions, createFragmentMap, namedClient };

import ApolloClient, { getFragmentDefinitions, createFragmentMap } from 'apollo-client';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';

const errors = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations,
        )}, Path: ${path}`,
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const init = (config, wsConfig, apolloConfig) => {
  if (!config) {
    console.warn(
      'Trying to initialize ApolloClient without config property, default config will be used.',
    );
  } else if (!config.uri) {
    console.warn(
      'Trying to initialize ApolloClient without config.uri property, default config.uri will be used.',
    );
  }

  const link = new HttpLink(config);

  const cache = new InMemoryCache().restore(window.__APOLLO_STATE__);

  const fullConfig = Object.assign(
    {},
    {
      link: link,
      cache: cache,
    },
    apolloConfig,
  );

  return new ApolloClient(fullConfig);
};

const namedClient = {};

export { init, gql, getFragmentDefinitions, createFragmentMap, namedClient };

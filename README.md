# Polymer Apollo GraphQL Client web components 🚀

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/element/reach-digital/polymer-apollo-client)

Easy integration with GraphQL.

<!--
```html
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-loader.js"></script>
    <script src="build/apollo-client.js"></script>
    <link rel="import" href="graphql-client.html">
    <link rel="import" href="graphql-query.html">
    <link rel="import" href="../polymer/lib/elements/dom-bind.html">
    <style>
      html {
        font-family: sans-serif; 
      }
    </style>
    <div>
      <dom-bind>
        <template is="dom-bind">
         <next-code-block></next-code-block>
        </template>
      </dom-bind>
    </div>
  </template>
</custom-element-demo>
```
-->
```html
<!-- To explore and play with the API, go to https://api.graphcms.com/simple/v1/swapi -->
<!-- This field is editable, so you can try things out -->

<graphql-client config='{"uri": "https://api.graphcms.com/simple/v1/swapi"}'></graphql-client>

<graphql-query result="{{data}}">
  query {
    Starship(name: "Millennium Falcon") {
      name
      class
    }
  }
</graphql-query>

<ul>
  <li>Name: [[data.Starship.name]]</li>
  <li>Class: [[data.Starship.class]]</li>
</ul>
```

## Getting started:

```html
<!-- Import the `build/apollo-client.js` in your website for a default setup -->
<script src="bower_components/polymer-apollo-client/build/apollo-client.js"></script>
```

```html
<!-- Import the `build/apollo-client-subscription.js` instead of `build/apollo-client.js`, if you need GraphQL subscriptions support -->
<script src="bower_components/polymer-apollo-client/build/apollo-client-subscription.js"></script>
```

```html
<!-- Import the `build/apollo-client-subscription-file-upload.js` instead of `build/apollo-client.js`, if you need file upload via GraphQL support -->
<script src="bower_components/polymer-apollo-client/build/apollo-client-subscription-file-upload.js"></script>
```

```html
<!-- Define a graphql-client somewhere once -->
<graphql-client config='{"uri": "https://api.graphcms.com/simple/v1/swapi"}'></graphql-client>

<graphql-query result="{{data}}">
  query {
    Starship(name: "Millennium Falcon") {
      name
      class
    }
  }
</graphql-query>

<ul>
  <li>Name: [[data.Starship.name]]</li>
  <li>Class: [[data.Starship.class]]</li>
</ul>
```

## Deferred queries
Deferred queries use `Polymer.Async.idlePeriod.run(executeQuery)` to defer the query execution to a later time.


```html
<!-- Client is already defined, so no need to do it twice -->
<graphql-query result="{{starShipsData}}" defer>
  query {
    allStarships(first: 5, filter: {pilots_some: {name_not: ""}}) {
      name
      class
      pilots {
        name
        homeworld {
          name
        }
      }
    }
  }
</graphql-query>

<template is="dom-repeat" items="[[starShipsData.allStarships]]" as="starship">
  <h2>[[starship.name]] ([[starship.class]])</h2>
  <ul>
    <template is="dom-repeat" items="[[starship.pilots]]" as="pilot">
      <li>[[pilot.name]] ([[pilot.homeworld.name]])</li>
    </template>
  </ul>
</template>
```

## Query variables

When the `variables` property changes, the query gets automatically re-fetched.

For a full blown example, take a look at the third demo. The gist is that you need to dynamically calculate the
variables object based on other properties of the element.

```html
<graphql-query result="{{pagination}}" variables="[[_calculateVariables(skip)]]">
  query Pagination($skip: Int!) {
    allStarships(first: 5, skip: $skip) {
      name
      class
    }
  }
</graphql-query>
```

## Options

You can pass options to `HttpLink()`, `WebSocketLink()` and `ApolloClient()` using
`config`, `wsConfig` and `apolloConfig` properties. It may be useful for authorization,
connection to Apollo Client DevTools, etc.

```html
<graphql-client
    config='{
      "uri": "https://graphql.endpoint/graphql",
      "transportBatching": true,
      "headers": {
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjamtjaDFhc2kwMDN5MGExNXhteHIydWMzIiwiaWF0IjoxNTMzNzE5MzY2fQ.gielaRu4-YVrixfuj4AHbVbVo1fBbewkJwFb93krmMQ"
      }
    }'
    ws-config='{
      "uri": "wss://graphql.endpoint/graphql",
      "options": {
        "reconnect": true,
        "connectionParams": {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjamtjaDFhc2kwMDN5MGExNXhteHIydWMzIiwiaWF0IjoxNTMzNzE5MzY2fQ.gielaRu4-YVrixfuj4AHbVbVo1fBbewkJwFb93krmMQ"
        }
      }
    }'
    apollo-config='{"connectToDevTools": true}'>
</graphql-client>
```

## Mutations (draft)

_Note: the current implementation for mutations is in draft, API might change in a future release._

The current implementation stays as close to the `<graphql-query>` as possible.

```html
<graphql-mutation id="contactMutation" variables="[[contactFormData]]" result="{{contactMutationResult}}">
  mutation SubmitContactForm(
    $name: String!,
    $email: String!,
    $phone: String!,
    $subject: String!,
    $message: String!
  ) {
    createContactForm(
      name: $name,
      email: $email,
      phone: $phone,
      subject: $subject,
      message: $message
    ) {
      id
    }
  }
</graphql-mutation>
```

```js
//Somewhere after your button has called submit()
this.contactFormData = {} //fill the contactMutation with the correct data.

//It will give an error if not everything is filled in correctly.
this.$.contactMutation.validate()

this.$.contactMutation.execute().then((result) => {
  //AMAZING RESULT, mutation has been submitted! 🎉
})
```

## Todo
- Better `<graphql-mutation>` API and documentation.
- Add Fragments examples (http://dev.apollodata.com/react/fragments.html)
- Add Pagination examples (http://dev.apollodata.com/react/optimistic-ui.html)
- Add Optimistic UI examples (http://dev.apollodata.com/react/optimistic-ui.html)

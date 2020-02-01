/**
## GraphQL mutation

_Note: the current implementation for mutations is in draft, API might change in a future release._

The current implementation stays as close to the `<graphql-query>` as possible.

_Note: to use file upload via GraphQL you should import `build/apollo-client-subscription-file-upload.js`
instead of `build/apollo-client.js`:_

```html
<script src="bower_components/polymer-apollo-client/build/apollo-client-subscription-file-upload.js"></script>
```

```
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

@group ApolloClient
@polymer
@customElement
@demo demo/full-demo.html Full demo
@demo demo/file-upload.html File upload
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import './graphql-query.js';

class GraphQLMutation extends GraphQLQuery {
  static get importMeta() {
    return import.meta;
  }

  static get is() {
    return 'graphql-mutation';
  }

  static get properties() {
    return {
      hold: {
        value: true
      },

      hostLoading: {
        type: Boolean,
        value: false,
        notify: true
      }
    };
  }

  /**
   * Execute the query/mutation directly
   * (used in combination with `hold` or with `<graphql-mutation>`).
   *
   * @return {Promise}
   */
  execute(params) {
    let validationResult = this.validate(params);
    if (validationResult.error) {
      console.error(validationResult.msg, this);
      return;
    }

    this.hostLoading = true;
    const mutation = this.query;
    const { variables } = this;
    const client = this._getClient();
    if (!client) {
      throw new Error(
        'There is no GraphQL client available. ' +
        'Initialize one on window.Apollo.client'
      );
    }

    return client.mutate(Object.assign({ mutation, variables }, params))
      .then((result) => {
        this.hostLoading = false;
        this.result = result.data;
      })
      .catch((error) => {
        this._handleError(error);
      });
  }
}

customElements.define(GraphQLMutation.is, GraphQLMutation);

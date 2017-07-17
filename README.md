# js-sdk

## Installation
Add this to your HTML:

#### Hasura projects created via beta.hasura.io

```html
<body>
    ...
    <script src="https://github.com/hasura/js-sdk/releases/download/v0.1.1/hasura.min.js"></script>
    <script>
        hasura.setProjectName('hello70'); // If your hasura project is hello70.hasura-app.io
    </script>
</body>
```

#### Hasura projects created via local-development or other methods

```html
<body>
    ...
    <script src="https://github.com/hasura/js-sdk/releases/download/v0.1.1/hasura.min.js"></script>
    <script>
        hasura.setBaseDomain('c103.hasura.me');
        hasura.disableHttps(); // No HTTPS enabled on local-development
    </script>
</body>
```


## Quickstart

```javascript
/* New session */
hasura.user // Will be anonymous user
// {
//     username: 'anonymous',
//     id: 0,
//     roles: ['anonymous'],
//     token: null
// }

/* Login and create new session */
hasura.setUsername('user1'); // Will set curename for current object and save to localStorage
hasura.login('user1password', onSuccess, onError); // Will log the current user
hasura.user // will be logged in user
// {
//     username: 'user1',
//     id: 3,
//     roles: ['user'],
//     token: 'xxxxxxxxxxxxxxxx'
// }

/* If you refresh the page */
hasura.user // will be the logged in user
// {
//     username: 'user1',
//     id: 3,
//     roles: ['user'],
//     token: 'xxxxxxxxxxxxxxxx'
// }
hasura.auth.logout(onSuccess, onError);
hasura.user // will be reset to anonymous user
```

### Data query

**NOTE**: In the examples below, `onSuccess` and `onError` are callback functions that you must implement.

```javascript
// This will use the hasura.user session object to send
// if hasura.user.token === null, then request is made as an anonymous user (no auth token)
hasura.data.query({
    type: 'select',
    args: {
        table: 'test',
        columns: ['*']
    },
    onSuccess,
    onError);

// Query with a specific role
hasura.data.queryAsRole('user'
    type: 'select',
    args: {
        table: 'test',
        columns: ['*']
    },
    onSuccess,
    onError);
```

### Data query-templates

**NOTE**: In the examples below, `onSuccess` and `onError` are callback functions that you must implement.

```javascript
// This will use the hasura.user session object to send
// if hasura.user.token === null, then request is made as an anonymous user (no auth token)
hasura.data.queryTemplate(
    'query-template-name',
    {
        param: <value>,
        param2: <value2>
    },
    onSuccess,
    onError);

// Query with a specific role
hasura.data.queryTemplateAsRole(
    'user',
    'query-template-name',
    {
        param: <value>,
        param2: <value2>
    },
    onSuccess,
    onError);
```

### Filestore uasage

The Hasura JS SDK provides convenience functions to upload and download files.

```html
    <input id="my-file" type="file" />
```

```javascript
    var input = document.getElementById('my-file');
    var file = input.files[0];
    var fileId;
    hasura.file.upload(
      file,
      (successResponse) => {
        fileId = successResponse.file_id;
        console.log('Uploaded file: ' + fileId);
        // your code goes here
      },
      (errorResponse) => {
        console.log('Error uploading file');
        console.log(errorResponse);
        // your code goes here
      });

    hasura.file.download(fileId); // This will use the HTML5 download attribute to start downloading the file

    hasura.file.delete(fileId);
```

### API requests to custom APIs deployed on Hasura

The Hasura JS SDK provides a simple wrapper over `fetch` to make it easy
for you to make API requests to APIs deployed as custom microservices on Hasura.

**If you're making a JSON request:**
```javascript
    hasura.fetch.upload(
      {
        service: 'api',  // the name of your custom service
        path: '/submit', // the path
        method: 'POST',  // HTTP method (this is POST by default, so you can ignore this key if it's POST)
        json: {...},     // set this to an object or an array that will be serialised to make the request body
        headers: {
          'X-Custom-Header': '...'
        }
      },
      (jsonResponse) => {
          // your success handler function
          console.log(jsonResponse);

          // By the way, jsonResponse is an object or an array
          // if the response content-type is application/json
          console.assert(typeof(jsonResponse) === 'object');
      },
      (error) => {
        // your error handler function
        console.error(error);
      });
```

**If you're making a request with a non JSON content-type:**
```javascript
    hasura.fetch.upload(
      {
        service: 'api',  // the name of your custom service
        path: '/submit', // the path
        method: 'POST',  // HTTP method (this is POST by default, so you can ignore this key if it's POST)
        body: '...',     // set this to a string or a serialised value
        headers: {
          'Content-Type': '...' // you must set the content-type, because the default content-type is set to application/json
        }
      },
      (response) => {
          // your success handler function
          console.log(response);

      },
      (error) => {
        // your error handler function
        console.error(error);
      });
```




# Contribution & Development

For development builds:
```sh
npm install
./node_modules/rollup/bin/rollup -c
```

This will output:

```sh
build/js/main.min.js
```

For production builds:
```sh
npm install
NODE_ENV=production ./node_modules/rollup/bin/rollup -c
```

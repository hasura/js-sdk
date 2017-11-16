# js-sdk

## Installation
Add this to your HTML:

#### Hasura projects created via beta.hasura.io

```html
<body>
    ...
    <script src="https://github.com/hasura/js-sdk/releases/download/v0.1.4/hasura.min.js"></script>
    <script>
        hasura.setProject('hello70'); // If your hasura project is hello70.hasura-app.io
    </script>
</body>
```

#### Hasura projects created via local-development or other methods

```html
<body>
    ...
    <script src="https://github.com/hasura/js-sdk/releases/download/v0.1.2/hasura.min.js"></script>
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

/* SignUp/register a new user */
hasura.setUsername('user1'); // Will set username for current object and save to localStorage
hasura.auth.signup('user1password', onSuccess, onError); // Will log the current user
//Or using a promise
hasura.auth.signup('user1password').then(function(response) {}, function(error) {});

/* Login and create new session */
hasura.setUsername('user1'); // Will set username for current object and save to localStorage
hasura.auth.login('user1password', onSuccess, onError); // Will log the current user
//Or using a promise
hasura.auth.loginPromise('user1password').then(function(response) {}, function(error) {});

//After signup/login
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
//Or using a promise
hasura.auth.logoutPromise().then(function(response) {}, function(error) {});

hasura.user // will be reset to anonymous user
```

### Data query
       
**Option 1:**

Use lambdas or anonymous functions directly for handling success/error.

```javascript
hasura.data.query({
  type: 'select',
  args: {
    table: 'article',
    columns: ['*']
  }},
  (data) => { console.log(data); },
  (error) => { console.log(error); }
);
```
**Option 2:**

Use predefined functions as shown below:

```javascript
function mySuccessHandler (data) {
  console.log(data);
}

function myErrorHandler (e) {
  console.log(e);
}

hasura.data.query({
  type: 'select',
  args: {
    table: 'article',
    columns: ['*']
  }},
  mySuccessHandler,
  myErrorHandler
);
```

**Option 3:**

Use promises:

```javascript
hasura.data.queryPromise({
  type: 'select',
  args: {
    table: 'article',
    columns: ['*']
  }
}).then(function(response){
    //handle response
}, function(error) {
    //handle error
});
```

### Filestore usage

The Hasura JS SDK provides convenience functions to upload and download files.

```html
    <input id="my-file" type="file" />
```

```javascript
    var fileInput = document.getElementById('my-file');
    var fileId;

    hasura.file.upload(
      fileInput,
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

    //You can also implement the above using promises instead of callbacks
    hasura.file.uploadPromise(fileInput).then(function(response) {}, function(error) {});

    hasura.file.download(fileId); // This will use the HTML5 download attribute to start downloading the file

    hasura.file.delete(fileId,
    (successResponse) => {},
    (errorResponse) => {});
    //Using promises
    hasura.file.deletePromise(fileId).then(function(response) {}, function(error) {});
```

### API requests to custom APIs deployed on Hasura

The Hasura JS SDK provides a simple wrapper over `fetch` to make it easy
for you to make API requests to APIs deployed as custom microservices on Hasura.

**If you're making a JSON request:**
```javascript
    hasura.fetch(
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
    hasura.fetch(
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

**You can also make the above call using promises**
```javascript
    hasura.fetchPromise({
      service: 'api',   // the name of your custom service
      path: '/path',    // the path
      method: 'POST',   // HTTP method (this is POST by default, so you can ignore this key if it's POST)
      json: {...},       // or body: '' if its not a JSON request
      headers: {
        'Content-Type': '...' // you must set the content-type, because the default content-type is set to application/json
      }
    }).then(function(response) {
        // your success handler function
        console.log(response);
    }, function(error) {
        //your error handler function
        console.log(error);
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

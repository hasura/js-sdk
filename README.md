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

### Enable Google Login

The Hasura JS SDK provides helper functions to quickly add Google Sign in to your application

Prerequisites:
  - Google OAuth2 Application

Initialization

Initialize Google SDK as follows

```javascript
  <script async defer src="https://apis.google.com/js/api.js" 
                          onload="this.onload=function(){};handleClientLoad()" 
                          onreadystatechange="if (this.readyState === 'complete') this.onload()">

  var GoogleAuth;
  var SCOPE = 'profile';
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }
  
  function initClient() {
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
      'clientId': '<CLIENT_ID>',
      'scope': SCOPE 
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();
  
      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(<callback function to handle state changes>);

      // Disconnect the user if the user has already signed in 
      GoogleAuth.disconnect();
    });
  }
```
To login:
  ```javascript
    hasura.auth.googleLogin( GoogleAuth, setSigninStatus );
  ```
To Logout:
  ```javascript
    hasura.auth.logout( () => { setSigninStatus(); GoogleAuth.disconnect(); });
  ```

Take a look at the example integration here


```html
    <input id="my-file" type="file" />
```



### Filestore usage

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

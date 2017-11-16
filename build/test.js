
hasura.setProject('commercialize81');

//Data
hasura.data.queryPromise({
  type: 'select',
  args: {
    table: 'article',
    columns: ['*']
  }
}).then(function(response) {
  console.log('Data Response');
  console.log(response);
}, function(error) {
  console.log('Data Error');
  console.log(error);
});

//Auth
hasura.setUsername('jaison');
hasura.auth.signUpPromise('my-password').then(function(response) {
  console.log('Auth Response');
  console.log(response);
}, function(error) {
  console.log('Auth Error');
  console.log(error);
})
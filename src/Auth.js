import logError from './logError';

const defaultExceptionHandler = () => (0);

class Auth {

  constructor (hasura) {
    this.hasura = hasura;
    this.apiVersion = 'v1';
  }

  /* options: {
   *   recaptcha: ''
   * }
   *
   */
  signup (password, onSuccess, onError = defaultExceptionHandler) {
    if (this.hasura.user.token) {
      logError('A user session already exists. Use this.hasura.logout() first?');
      onError({'code': 'already-logged-in'});
      return;
    }

    const body = {
      provider: 'username',
      data: {
        username: this.hasura.user.username,
        password
      }
    };

    var version = this.apiVersion;
    this.hasura.fetch(
      {service: 'auth', path: version + '/signup', json: body},
      (user) => {
        this.hasura.user = {
          ...this.hasura.user,
          id: user.hasura_id,
          roles: user.hasura_roles
        };
        if (user.auth_token) {
          this.hasura.user.token = user.auth_token;
        }
        this.hasura.saveUser();
        onSuccess(user);
      },
      (r) => {
        console.log(r);
        onError(r);
      });
  }

  login (password, onSuccess, onError = defaultExceptionHandler) {
    if (this.hasura.user.token) {
      logError('A user session already exists. Use this.hasura.logout() first?');
      onError({'code': 'already-logged-in'});
      return;
    }

    var version = this.apiVersion;

    this.hasura.fetch(
      {service: 'auth', path: version + '/login', json: {username: this.hasura.user.username, password}},
      (user) => {
        this.hasura.user = {
          ...this.hasura.user,
          id: user.hasura_id,
          roles: user.hasura_roles,
          token: user.auth_token
        };
        this.hasura.saveUser();
        onSuccess(user);
      },
      (r) => {
        console.log(r);
        onError(r);
      });
  }

  logout (onSuccess, onError = defaultExceptionHandler) {
    var version = this.apiVersion;
    this.hasura.fetch(
      {service: 'auth', path: version + '/user/logout'},
      () => {
        this.hasura.clearUser();
        onSuccess();
      },
      (r) => {
        console.log(r);
        onError(r);
      });
  }

  signUpPromise(password) {
    var self = this;
      return new Promise(function(resolve, reject) {
          self.signup(password, function(response) {
              resolve(response);
          }, function(error) {
              reject(error);
          }, function(exception) {
              reject(exception);
          });
      });
  }

  loginPromise(password) {
    var self = this;
      return new Promise(function(resolve, reject) {
          self.login(password, function(response) {
              resolve(response);
          }, function(error) {
              reject(error);
          }, function(exception) {
              reject(exception);
          })
      })
  }

  logoutPromise() {
    var self = this;
      return new Promise(function(resolve, reject) {
          self.logout(function(response) {
              resolve(response);
          }, function(error) {
              reject(error);
          });
      })
  }

}

export default Auth;

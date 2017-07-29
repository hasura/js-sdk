import logError from './logError';

const defaultExceptionHandler = () => (0);

class Auth {
  constructor (hasura) {
    this.hasura = hasura;
  }

  /* options: {
   *   recaptcha: ''
   * }
   *
   */
  signup (password, options, onSuccess, onError = defaultExceptionHandler) {
    if (this.hasura.user.token) {
      logError('A user session already exists. Use this.hasura.logout() first?');
      return;
    }

    const body = { username: this.hasura.user.username, password };
    if (this.hasura.user.email) {
      body.email = this.hasura.user.email;
    }
    if (this.hasura.user.mobile) {
      body.mobile = this.hasura.user.mobile;
    }

    this.hasura.fetch(
      {service: 'auth', path: '/signup', json: body},
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
        onSuccess();
      },
      (r) => {
        console.log(r);
        onError();
      });
  }
  login (password, onSuccess, onError = defaultExceptionHandler) {
    if (this.hasura.user.token) {
      logError('A user session already exists. Use this.hasura.logout() first?');
      return;
    }

    this.hasura.fetch(
      {service: 'auth', path: '/login', json: {username: this.hasura.user.username, password}},
      (user) => {
        this.hasura.user = {
          ...this.hasura.user,
          id: user.hasura_id,
          roles: user.hasura_roles,
          token: user.auth_token
        };
        this.hasura.saveUser();
        onSuccess();
      },
      (r) => {
        console.log(r);
        onError();
      });
  }

  logout (onSuccess, onError = defaultExceptionHandler) {
    this.hasura.fetch(
      {service: 'auth', path: '/user/logout'},
      () => {
        this.hasura.clearUser();
        onSuccess();
      },
      (r) => {
        console.log(r);
        onError();
      });
  }

  googleLogin ( GoogleAuth, onSuccess, onError = defaultExceptionHandler ) {
    /* Requires GoogleAuth global object to function */
    if ( GoogleAuth ) {
      const currentUser = GoogleAuth.currentUser.get();
      const authData = currentUser.getAuthResponse();
      const id = currentUser.getId();

      if ( Object.keys(authData).length !== 0 ) {
        this.hasura.fetch(
          { service: 'auth', path: '/google/authenticate?id_token=' + authData.id_token, method: 'GET' },
          ( user ) => {
            this.hasura.user = {
              ...this.hasura.user,
              id: user.hasura_id,
              roles: user.hasura_roles,
              token: user.auth_token,
              username: 'google:' + id
            };
            this.hasura.saveUser();
            onSuccess();
          },
          (r) => {
            console.log(r);
            onError();
          });
        return;
      }
      console.error('Could\'t find user information, Error could be because user is not logged into Google');
      return;
    }
    console.error('Hasura requires a valid Google auth instance to authenticate. Checkout https://github.com/hasura/js-sdk for more info');
  }

}

export default Auth;

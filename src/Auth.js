import logError from './logError';

const defaultExceptionHandler = () => (0);

class Auth {
  constructor (hasura) {
    this.hasura = hasura;
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

}

export default Auth;

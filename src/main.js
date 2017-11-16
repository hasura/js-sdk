import {hasuraFetch, hasuraGenUrl} from './hasuraFetch';
import Auth from './Auth';
import Data from './Data';
import File from './File';

const anonUser = {
  username: 'anonymous',
  id: 0,
  roles: ['anonymous'],
  token: null
};

const localStorage = window.localStorage;

class hasura {
  /*
   * hasura.user
   * hasura.auth (signup/login/logout)
   * hasura.data.query({}, onSuccess, onError)
   * hasura.fetch(options, onSuccess, onError)
   */
  constructor () {
    // Load user-data from localStorage
    const u = localStorage.getItem('hasura.user');
    if (u) {
      this.user = JSON.parse(u);
    } else {
      this.user = anonUser;
    }

    this.projectConfig = {
      scheme: 'https',
      baseDomain: null
    };
    this.resetFetch();
    this.auth = new Auth(this);
    this.data = new Data(this);
    this.file = new File(this);
  }

  resetFetch() {
    this.fetch = hasuraFetch(this.user, this.projectConfig);
    var self = this;
    this.fetchPromise = (query) => {
      return new Promise(function(resolve, reject) {
        self.fetch(query, function(response) {
          resolve(response);
        }, function(error) {
          reject(error);
        })
      });
    };
    this.genUrl = hasuraGenUrl(this.projectConfig);
    return this;
  }

  setProject (name) {
    this.projectConfig.baseDomain = name + '.hasura-app.io';
    this.resetFetch();
    return this;
  }

  setBaseDomain(baseDomain) {
    this.projectConfig.baseDomain = baseDomain;
    this.resetFetch();
    return this;
  }

  disableHttps() {
    this.projectConfig.scheme = 'http';
    this.resetFetch();
  }

  setUsername(username) {
    this.user.username = username;
    this.saveUser();
  }

  setUserInfo(userInfo) {
    this.user = {
      ...this.user,
      id: userInfo.hasura_id,
      roles: userInfo.hasura_roles,
      token: userInfo.auth_token,
    };

    ['username', 'email', 'mobile'].map(x => {
      this.user[x] = userInfo[x] ? userInfo[x] : this.user[x];
    });

    this.saveUser();
  }

  saveUser() {
    localStorage.setItem('hasura.user', JSON.stringify(this.user));
    this.resetFetch();
  }

  clearUser() {
    this.user = anonUser;
    this.saveUser();
  }

  clearSession() { this.clearUser(); }

}

export default (new hasura());

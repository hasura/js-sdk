import logError from './logError';

const defaultExceptionHandler = () => (0);

class Data {
  constructor (hasura) {
    this.hasura = hasura;
  }

  queryAsRole (role, query, onSuccess, onError = defaultExceptionHandler) {
    this.query(query, onSuccess, onError, role);
  }

  query(query, onSuccess, onError = defaultExceptionHandler, role = null) {
    const opts = {service: 'data', path: '/v1/query', json: query};
    if (role) {
      opts.role = role;
    }
    this.hasura.fetch(
      opts,
      (result) => {
        onSuccess(result);
      },
      (e) => {
        logError(e);
        onError(e);
      });
  }

  queryTemplateAsRole(role, template, params, onSuccess, onError = defaultExceptionHandler) {
    this.queryTemplate(template, params, onSuccess, onError, role);
  }

  queryTemplate(template, params, onSuccess, onError = defaultExceptionHandler, role = null) {
    const opts = {service: 'data', path: '/v1/template/' + template, json: params};
    if (role) {
      opts.role = role;
    }

    this.hasura.fetch(
      opts,
      (result) => {
        onSuccess(result);
      },
      (e) => {
        logError(e);
        onError(e);
      });
  }
}

export default Data;

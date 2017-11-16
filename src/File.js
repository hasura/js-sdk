import logError from './logError';

const defaultExceptionHandler = () => (0);

const guid = () => ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
  return v.toString(16);
}));

class File {
  constructor (hasura) {
    this.hasura = hasura;
  }

  queryPromise(hasuraFetchOptions) {
    return new Promise(function(resolve, reject) {
      this.query(hasuraFetchOptions, function(response) {
        resolve(response);
      }, function(error) {
        reject(error);
      });
    });
  }

  query(hasuraFetchOptions, onSuccess, onError) {
    const opts = hasuraFetchOptions;
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

  uploadPromise(fileInput) {
    return new Promise(function(resolve, reject) {
      this.upload(fileInput, function(response) {
        resolve(response);
      }, function(error) {
        reject(error);
      });
    });
  }

  upload(fileInput, onSuccess, onError = defaultExceptionHandler) {
    const file = fileInput.files[0];
    if (!file) {
      logError('No file received from expected input[type=file] DOM element.');
      logError(fileInput);
      return;
    }

    const hasuraFetchOptions = {
      service: 'filestore',
      path: `/v1/file/${guid()}`,
      headers: {'Content-Type': file.type},
      body: file
    };

    this.query(hasuraFetchOptions, onSuccess, onError);
  }

  delete(fileId, onSuccess, onError = defaultExceptionHandler) {
    const hasuraFetchOptions = {
      service: 'filestore',
      method: 'DELETE',
      path: `/v1/file/${fileId}`
    };

    this.query(hasuraFetchOptions, onSuccess, onError);
  }

  deletePromise(fileId) {
    return new Promise(function(resolve, reject) {
      this.delete(fileId, function(response) {
        resolve(response);
      }, function(error) {
        reject(error);
      });
    });
  }

  download(fileId) {
    var link = document.createElement('a');
    link.download = fileId;
    link.href = this.hasura.genUrl('filestore', `/v1/file/${fileId}`);
    link.click();
  }

}

export default File;

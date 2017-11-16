import 'whatwg-fetch';
import logError from './logError';

const defaultHeaders = {
    'Content-Type': 'application/json'
};

const emitError = (options, response) => {
    logError('>>>');
    logError(options);
    logError('<<<');
    logError(response);
};

const defaultExceptionHandler = () => (0);

const maybeResponseJSON = (options, response, onSuccess, onException = defaultExceptionHandler) => {
    response.text().then(
        (t) => {
            if (response.headers.get('Content-Type').indexOf('application/json') > -1) {
                onSuccess(JSON.parse(t));
            } else {
                onSuccess(t);
            }
        },
        (e) => {
            logError('Successful response, but failed to read response: ');
            emitError(options, response);
            logError(e);
            onException();
        });
};

const hasuraGenUrl = (projectConfig) => {
    return (service, path) => {
        const url = projectConfig.scheme + '://' + service + '.' + projectConfig.baseDomain + path;
        return url;
    };
};

const hasuraFetch = (user, projectConfig) => {

    return (options, onSuccess, onError, onException = defaultExceptionHandler) => {
        if (!projectConfig.baseDomain) {
            logError('Please use hasura.setProject or hasura.setBaseDomain before making any API calls.');
            return;
        }

        const headers = {...defaultHeaders, ...options.headers};

        // Add the authorization header
        if (user.token && (options.role !== 'anonymous')) {
            headers.Authorization = 'Bearer ' + user.token;
        }

        if (options.role && (options.role !== 'anonymous')) {
            headers['X-Hasura-Role'] = options.role;
        }

        const url = hasuraGenUrl(projectConfig)(options.service, options.path);

        fetch(url, {
            method: options.method ? options.method : 'POST',
            headers,
            body: options.json ? JSON.stringify(options.json) : (options.body ? options.body : null)
        }).then(
            (response) => {
                if (response.status >= 200 && response.status < 300) {
                    maybeResponseJSON(options, response, onSuccess, onException);
                } else if (response.status >= 300 && response.status < 400) {
                    logError('Redirect response received. Are you sure you\'re querying the right endpoint?');
                    emitError(options, response);
                    maybeResponseJSON(options, response, onError);
                } else if (response.status >= 400 && response.status < 500) {
                    logError('Invalid request made (bad request):');
                    emitError(options, response);
                    maybeResponseJSON(options, response, onError);
                } else if (response.status > 500) {
                    logError('Server error:');
                    emitError(options, response);
                    maybeResponseJSON(options, response, onError);
                } else {
                    logError('Unhandled error in Hasura SDK. Please file an issue at github.com/hasura/support with the information below:');
                    emitError(options, response);
                    onException();
                }
            },
            (error) => {
                logError('Failed to make request. Check http/https, service name, base domain or path values used?\n>>>')
                logError(options)
                logError('<<<')
                logError(error)
                onException(error);
            });
    };

};

export {hasuraFetch, hasuraGenUrl};

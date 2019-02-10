const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'user-agent': 'Mozilla/4.0 MDN',
  'content-type': 'application/json'
};

// Default options are marked with *
const DEFAULT_OPTIONS = {
  cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *omit
  mode: 'cors', // no-cors, *same-origin
  redirect: 'follow', // *manual, follow, error
  referrer: 'no-referrer', // *client
};

function deleteData(url, data) {
  const method = 'DELETE';
  const body = JSON.stringify(data);
  const headers = DEFAULT_HEADERS;
  const opts = {body, method, headers, ...DEFAULT_OPTIONS};

  return fetchApi(url, opts);
}

function putData(url, data) {
  const method = 'PUT';
  const body = JSON.stringify(data);
  const headers = DEFAULT_HEADERS;
  const opts = {body, method, headers, ...DEFAULT_OPTIONS};

  return fetchApi(url, opts);
}

function postData(url, data) {
  const method = 'POST';
  const body = JSON.stringify(data);
  const headers = DEFAULT_HEADERS;
  const opts = {body, method, headers, ...DEFAULT_OPTIONS};

  return fetchApi(url, opts);
}

function getData(url) {
  const method = 'GET';
  const headers = DEFAULT_HEADERS;
  const opts = {method, headers, ...DEFAULT_OPTIONS};

  return fetchApi(url, opts);
}

function fetchApi(url, opts) {
  return fetch(url, opts).then(response => {
    // Shorthand to check for an HTTP 2xx response status.
    if (response.ok) {
      return response;
    }
    // Raise an exception to reject the promise and trigger the outer .catch() handler.
    // By default, an error response status (4xx, 5xx) does NOT cause the promise to reject!
    throw Error(response);
  }).then(function(response) {
    return response.json();
  }).catch(
    error => {
      console.error(error);
      return Promise.reject(error);
    }
  );
}

export {getData, putData, postData, deleteData};

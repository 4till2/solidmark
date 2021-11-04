/* TODO: Here lies the api bridge. Connect this to Solid, and handle formatting as expected by app. Should work?
  Since all outbound requests come through fetcher, we can leave the rest of the app as is and work behind the scenes to
  convert api format requests to SOLID requests, and convert SOLID responses to api format.

  If I can successfully move Solid to just this file then Solid can be integrated with any existing application, by just knowing
  the expected requests, and responses.

  -> : Transfer
  => : Conversion

  APPLICATION -> API REQUEST => SOLID REQUEST -> SOLID RESPONSE => API RESPONSE -> APPLICATION

  Method:
  Fetcher takes a url directing to the api. Handle the conversion based on the definition of the url.
  (ie. /login -> Solid login -> Solid response => api response -> {response}
 */
const SOLID = true;
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import solidFetcher from './solid';
import {solidPostResponse} from './solid';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? `http://${document.location.hostname}:8001/api`
    : '/api';

const defaultOptions = {
  credentials:
    process.env.NODE_ENV === 'development' ? 'include' : 'same-origin'
};
let controller;
const formatResponse = (response) =>
  // if (response.status >= 200 && response.status < 300) {
  //   return response;
  // }

  // const error = new Error(response.statusText);

  // error.response = response;
  // throw error;

{
  let ret = {
    data: SOLID ? solidPostResponse(response) : response,
    error: response.message || response.error
  }
  return ret
};
const checkEmptyResponse = (response) => {
  if (response.statusText === 'No Content' || response.status === 204) {
    return {};
  }
  return response.json();
};
const abortFetch = () => {
  controller && controller.abort();
};

const fetcher = ({
  params,
  method = 'GET',
  url,
  onSuccess,
  onError,
  options = {}
}) => {
  controller = new AbortController();
  if (method === 'GET') {
    (SOLID ? solidFetcher(url, method) : fetch(`${baseUrl}${url}`, {
      ...defaultOptions,
      ...options,
      signal: controller.signal
    }))
      .then((response) => checkEmptyResponse(response))
      .then(formatResponse)
      .then((response) => {
        const { data, error } = response;
        if (error) {
          onError(error);
        } else {
          onSuccess(data);
        }
      })
      .catch((error) => {
        // console.error('CUSTOM ERROR: in fetcher/index.js line 85: \n', error)
        if (error.name !== 'AbortError') {
          onError(error.statusText || 'error.default');
        }
      });
  }

  if (
    method === 'POST' ||
    method === 'DELETE' ||
    method === 'PUT' ||
    method === 'PATCH'
  ) {
    (SOLID ? solidFetcher(url, method, params) : fetch(`${baseUrl}${url}`, {
      ...defaultOptions,
      ...options,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
      signal: controller.signal
    }))
      .then((response) => checkEmptyResponse(response))
      .then(formatResponse)
      .then((response) => {
        const { data, error } = response;

        if (error) {
          onError(error);
        } else {
          onSuccess(data);
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          onError(error.statusText || 'error.default');
        }
      });
  }
};

export { abortFetch };

export default fetcher;

import {getDefaultSession} from '@inrupt/solid-client-authn-browser';

// The webid of the currently logged in Solid account
export function webId() {
  let session = getDefaultSession();
  return session.info.webId;
}

export function generateRandomId() {
  return Math.floor(Math.random() * Date.now()).toString();
}

export function getBookmarkIdFromUrl(url) {
  return url.split('/').pop()
}

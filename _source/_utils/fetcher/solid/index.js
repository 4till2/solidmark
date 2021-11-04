// Necessary to allow async to work
import 'regenerator-runtime/runtime.js';

import {fetch, getDefaultSession, handleIncomingRedirect, login} from '@inrupt/solid-client-authn-browser';
import {
  buildThing,
  createSolidDataset,
  createThing,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getThingAll,
  removeThing,
  saveSolidDatasetAt,
  setThing
} from '@inrupt/solid-client';
import {FOAF, RDF, SCHEMA_INRUPT} from '@inrupt/vocab-common-rdf';

import {CATEGORY_ID, DASHBOARD, POD_ISSUER, POD_ROOT, SOLIDMARK_PATH} from './constants';
import {formatBookmark, formatResponse, formatUser} from './formatters';
import {generateRandomId, getBookmarkIdFromUrl, webId} from './helpers';

function loginToSolid() {
  return login({
    oidcIssuer: POD_ISSUER,
    redirectUrl: window.location.href,
    clientName: 'Solidmark'
  });
}

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect({restorePreviousSession: true});
  const session = getDefaultSession();

  return session.info.isLoggedIn;

}

async function readName() {
  const profile = await readProfile();

  return profile ? getStringNoLocale(profile, FOAF.name) : false;
}

async function rootPodUrl() {
  const name = await readName();

  if (!name) {
    return false;
  }
  return `${POD_ROOT}${name}`;
}

async function readProfile() {
  const id = webId();

  if (!id) {
    return false;
  }
  // Assuming the profile is stored after '#'
  const profileDocumentURI = id.split('#')[0];
  const myDataset = await getSolidDataset(profileDocumentURI, {fetch: fetch});

  return getThing(myDataset, id);
}

function readBookmarkAttributes(bookmark) {
  return {
    'id': getStringNoLocale(bookmark, SCHEMA_INRUPT.identifier),
    'name': getStringNoLocale(bookmark, SCHEMA_INRUPT.name),
    'url': getStringNoLocale(bookmark, SCHEMA_INRUPT.url),
    'note': getStringNoLocale(bookmark, SCHEMA_INRUPT.description)
  };
}

async function getBookmarks(categoryId) {
  const podUrl = await rootPodUrl();
  const categoryUrl = `${podUrl}/${SOLIDMARK_PATH}/categories/${categoryId}`;
  let bookmarks;

  try {
    const category = await getSolidDataset(categoryUrl, {fetch: fetch});

    bookmarks = getThingAll(category);
  } catch (error) {
    if (typeof error.statusCode === 'number' && error.statusCode === 404) {
      return {error: 'Category Not Found'};
    }
    return {error: error.message};

  }
  // getThingAll returns the containing folder, which is not a bookmark. pop() to remove it.
  bookmarks.pop();
  return {
    'bookmarks': bookmarks.map((b, index) => {
      const bookmarkAttributes = readBookmarkAttributes(b);

      return formatBookmark({...bookmarkAttributes, categoryId: categoryId, position: index});
    })
  };
}

async function createBookmark({categoryId, bookmarkId = generateRandomId(), name, note = '', url}) {
  const podUrl = await rootPodUrl();
  const categoryUrl = `${podUrl}/${SOLIDMARK_PATH}/categories/${categoryId}`;
  let category;

  // find or create category
  try {
    category = await getSolidDataset(categoryUrl, {fetch: fetch});
  } catch (error) {
    if (typeof error.statusCode === 'number' && error.statusCode === 404) {
      category = createSolidDataset();
    } else {
      return false;
    }
  }
  const bookmark = buildThing(createThing({name: bookmarkId}))
    .addStringNoLocale(SCHEMA_INRUPT.identifier, bookmarkId)
    .addStringNoLocale(SCHEMA_INRUPT.name, name)
    .addStringNoLocale(SCHEMA_INRUPT.url, url)
    .addStringNoLocale(SCHEMA_INRUPT.description, note)
    .addUrl(RDF.type, 'https://schema.org/WebSite')
    .build();

  category = setThing(category, bookmark);
  try {
    await saveSolidDatasetAt(
      categoryUrl,
      category,
      {fetch: fetch}
    );
    return getBookmarks(categoryId);
  } catch (error) {
    return false;
  }
}

async function deleteBookmark({categoryId, bookmarkId}) {
  const podUrl = await rootPodUrl();
  const categoryUrl = `${podUrl}/${SOLIDMARK_PATH}/categories/${categoryId}`;
  let category;

  try {
    category = await getSolidDataset(categoryUrl, {fetch: fetch});
  } catch (error) {
    return false;
  }
  const updatedCategory = await removeThing(category, `${categoryUrl}#${bookmarkId}`);

  await saveSolidDatasetAt(
    categoryUrl,
    updatedCategory,
    {fetch: fetch} // fetch from authenticated Session
  );
  return true;
}

// The format expected for a bookmarks response is array of bookmarks without object key 'bookmarks', however it causes an error with formatResponse() so we are fixing the formatting
// after the response reaches the main fetcher. This is not an ideal solution and should be fixed.
function solidPostResponse(response) {
  if (response.bookmarks) {
    return response.bookmarks;
  }
  return response;
}

// All requests and responses flow through here. Handles the calling the correct routers and formatters with proper parameters.
export default async function solidFetcher(url, method, params = {}) {
  if (url === '/login') {
    await loginToSolid();
  } else if (url === '/user') {
    // READ: logBook/placing_the_handleRedirectAfterLogin_function.md
    const isLoggedIn = await handleRedirectAfterLogin();

    if (isLoggedIn) {
      await readProfile();
      return formatResponse(formatUser(readName()));
    }
    return {};
  } else if (url === '/dashboards') {
    return formatResponse(DASHBOARD);
  } else if (url.includes('bookmarks')) {
    if (method === 'POST') {
      return formatResponse(createBookmark({categoryId: CATEGORY_ID, ...params}));
    } else if (method === 'PATCH') {
      return formatResponse(createBookmark({categoryId: CATEGORY_ID, bookmarkId: getBookmarkIdFromUrl(url), ...params}));
    } else if (method === 'DELETE') {
      await deleteBookmark({categoryId: CATEGORY_ID, bookmarkId: getBookmarkIdFromUrl(url)});
      return formatResponse({'success': true});
    }
    const bookmarks = await getBookmarks(CATEGORY_ID);

    return formatResponse(bookmarks);
  } else if (url === '/logout') {
    await getDefaultSession().logout();
    return formatResponse({'success': true});
  }
  return {};
}

export {solidPostResponse};

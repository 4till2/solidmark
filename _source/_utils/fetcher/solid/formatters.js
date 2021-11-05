import {DASHBOARD_ID} from './constants';

export function formatResponse(obj) {
  let init = obj.length ? {'status': 204, 'statusText': 'No Content'} : {'status': 200, 'statusText': 'SuperSmashingGreat!'};
  let blob = new Blob([JSON.stringify(obj, null, 2)], {type: 'application/json'});
  let res = new Response(blob, init);

  return res;
}

export function formatBookmark({id, name, url, note, categoryId, position}) {
  return {
    'id': Number(id),
    'name': name,
    'url': url,
    'position': position,
    'categoryId': categoryId,
    'clicked': 0,
    'note': note,
    'faviconId': 6,
    'favicon': 'default'
  };
}

// The default user and their settings, since we don't yet support saving settings.
export function formatUser(name="Solid Boss") {
  return {
    'name': name,
    'title': 'New Member',
    'email': '',
    'new': false,
    'premium': false,
    'settings': {
      'autofillBookmarkNames': true,
      'colorScheme': 0,
      'displayDashboardsAsSidebar': false,
      'enableNotes': true,
      'openLinksInNewTab': true,
      'defaultDashboardId': DASHBOARD_ID,
      'navigationBarColor': 0,
      'blurEffect': false,
      'darkMode': true,
      'dashboardsStyle': 'sidebar',
      'maxWidth': false,
      'pinned': true,
      'preserveEditMode': false,
      'stickyHeader': false,
      'stickyToolbar': false,
      'language': 'en',
      'bookmarkEditOnHover': true,
      'autofocusSearch': false,
      'minimalBookmarkButton': false,
      'closeEditMode': true,
      'categoriesLayout': 'grid',
      'maxColumnCount': null,
      'newsVersion': 13,
      'voted': 0
    }
  };
}

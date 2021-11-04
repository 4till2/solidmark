// Which pod server to login with
export const POD_ISSUER = 'https://broker.pod.inrupt.com';

// The pod address to find user (usually POD_ROOT/user)
export const POD_ROOT = 'https://pod.inrupt.com/';

// The path to save the bookmarks within a Pod.
export const SOLIDMARK_PATH = 'solidmark';

// The original app supports multiple categories for bookmarks. Not yet translated.
export const CATEGORY_ID = 1;

// The original app supports multiple dashboards of categories. Not yet translated.
export const DASHBOARD_ID = 1;

// The default dashboard and category since we dont yet support multiple.
export const DASHBOARD = {
  'dashboards': [
    {
      'id': DASHBOARD_ID,
      'name': 'My collection',
      'position': 1
    }
  ],
  'activeCategories': [
    {
      'id': CATEGORY_ID,
      'dashboardId': DASHBOARD_ID,
      'name': 'My Bookmarks',
      'position': 1,
      'hidden': false,
      'color': 'color3'
    }
  ]
};

export const parseBookmarkUrl = (url, { protocol } = {}) => {
  const cleanUrl = url.replace(/[^\w\].,!@#$%^&*()?[:;//=+~`'-]/gi, '');

  return cleanUrl.match(/^([a-z]+:+)\/\/|^\/\//i)
    ? cleanUrl
    : `${protocol ? protocol : ''}${protocol ? ':' : ''}//${cleanUrl}`;
};

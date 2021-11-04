The most challenging thing so far was to figure out how to get my data from the pod server back to the intial request
without them knowing. To begin with I knew I needed a `Response` object with the corrosponding fields filled out. I took
a peek at the callbacks after the regular `fetch` method where I am doing my hijacking and got an idea of what those
are. From my SolidFetcher I am simply getting the api request and getting or setting the coresponding info from Solid
and reformatting it into the `Response`.

### Current Code

```javascript
//... function loginToSolid(), function handleRedirectAfterLogin(), ETC.

handleRedirectAfterLogin();

async function solidFetch(url) {
  if (url === '/login') {
    loginToSolid();
  } else if (url === '/user') {
    let isLoggedIn = await handleRedirectAfterLogin();
    return isLoggedIn ?
      formatToResponse(getUserInfoFromPod(getDefaultSession().info.webId) || {})
      : {};
  }
  //...
}

function formatToResponse(obj) {
  // Probably best to make this more dynamic based on the actual response from the Solid Server.
  let init = obj.length ? {'status': 204, 'statusText': 'No Content'} : {
    'status': 200,
    'statusText': 'SuperSmashingGreat!'
  };
  let blob = new Blob([JSON.stringify(obj, null, 2)], {type: 'application/json'});
  let res = new Response(blob, init);
  return res;
}
```

### Problem

The issue I faced is with Logging In. Since solid requires a call to the solid server on every page reload (even
with `restorePreviousSession: true` a call is made behind the scenes), meaning on page load the user is always logged
out until the `defaultSession` is set and available by calling `getDefaultSession`. This means that when a page loads
even after coming directly back from logging into the pod provider, the app tries to get the `/user` info
before `handleIncomingRedirect` within `handleRedirectAfterLogin` has a chance to update the session.

### Solution

By placing `handleRedirectAfterLogin` within the `/user` api request directly we can wait for it before returning
anything to the user. I placed a boolean return value within `handleRedirectAfterLogin` to let me know if the user is
logged in or not. Now on any page load that calls `/user`, including when a user returns from signing in to their pod
provider, the response will wait for the pod provider's response before checking if they are logged in or not.

```javascript
// RELOCATE: handleRedirectAfterLogin();

async function solidFetch(url) {
  if (url === '/login') {
    loginToSolid();
  } else if (url === '/user') {
    let isLoggedIn = await handleRedirectAfterLogin();
    return isLoggedIn ? formatToResponse(getUser()) : {};
  }
  //...
}
```
### Takeaway
The lifecycle of a Solid app is a bit different, so when working to integrate along side
an established lifecycle, take care to work accordingly. The good news is that other than session
handling I dont expect other api requests to have any synchronicity issues. Response format is another issue :)

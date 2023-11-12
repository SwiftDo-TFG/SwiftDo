
/**
 * Module dependencies.
 */

const db = require('../bd/pool.js');
const crypto = require('crypto')

/*
 * Get access token.
 */

module.exports.getAccessToken = function (bearerToken) {
  return db.query('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE access_token = $1', [bearerToken])
    .then(function (result) {
      var token = result.rows[0];

      return {
        accessToken: token.access_token,
        client: { id: token.client_id },
        expires: token.expires,
        user: { id: token.userId }, // could be any object
      };
    });
};

/**
 * Get client.
 */

module.exports.getClient = function* (clientId, clientSecret) {
  console.log("GET CLIENT")

  return db.query('SELECT client_id, client_secret, redirect_uri, grants FROM oauth_clients WHERE client_id = $1', [clientId])
    .then(function (result) {
      var oAuthClient = result.rows[0];

      if (!oAuthClient) {
        return;
      }

      return {
        clientId: oAuthClient.client_id,
        clientSecret: oAuthClient.client_secret,
        redirectUris: [oAuthClient.redirect_uri],
        grants: [oAuthClient.grants], // the list of OAuth2 grant types that should be allowed
      };
    });
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function* (bearerToken) {
  return db.query('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE refresh_token = $1', [bearerToken])
    .then(function (result) {
      return result.rowCount ? result.rows[0] : false;
    });
};

/*
 * Get user.
 */

module.exports.getUser = function* (username, password) {
  return db.query('SELECT id FROM users WHERE username = $1 AND password = $2', [username, password])
    .then(function (result) {
      return result.rowCount ? result.rows[0] : false;
    });
};

/**
 * Save token.
 */

module.exports.saveAccessToken = function* (token, client, user) {
  return db.query('INSERT INTO oauth_tokens(access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id) VALUES ($1, $2, $3, $4)', [
    token.accessToken,
    token.accessTokenExpiresOn,
    client.id,
    token.refreshToken,
    token.refreshTokenExpiresOn,
    user.id
  ]).then(function (result) {
    return result.rowCount ? result.rows[0] : false; // TODO return object with client: {id: clientId} and user: {id: userId} defined
  });
};


/**
 * Save Auth code.
 */

module.exports.saveAuthorizationCode = async function (code, client, user) {
  console.log("SAVE AUTH CODE", code, client, user);

  const result = await db.query('INSERT INTO public.oauth_authcode(authorization_code, expires_at, redirect_uri, client_id, user_id) VALUES ($1, $2, $3, $4, $5)', [
    code.authorizationCode,
    code.expiresAt,
    code.redirectUri,
    client.clientId,
    user.user
  ])
  
  if(result.rowCount === 1){
    return {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: {id: client.clientId},
      user: {id: user.user}
    }
  }
  return false; // TODO return object with client: {id: clientId} and user: {id: userId} defined
}


module.exports.generateAuthorizationCode = function (client, user, scope) {
  console.log("GENERANDO el AUTH CODE", client, user, scope)

  const seed = crypto.randomBytes(256)
  const code = crypto
    .createHash('sha1')
    .update(seed)
    .digest('hex')

  return code
}


module.exports.getAuthorizationCode = function () {
  console.log("BUSCANDO EL AUTH CODE")

}

module.exports.revokeAuthorizationCode = function() {
  /* This is where we delete codes */
  log({
    title: 'Revoke Authorization Code',
    parameters: [
      { name: 'authorizationCode', value: authorizationCode },
    ],
  })
  db.authorizationCode = { // DB Delete in this in memory example :)
    authorizationCode: '', // A string that contains the code
    expiresAt: new Date(), // A date when the code expires
    redirectUri: '', // A string of where to redirect to with this code
    client: null, // See the client section
    user: null, // Whatever you want... This is where you can be flexible with the protocol
  }
  const codeWasFoundAndDeleted = true  // Return true if code found and deleted, false otherwise
  return new Promise(resolve => resolve(codeWasFoundAndDeleted))
}

module.exports.verifyScope= function(token, scope){
  /* This is where we check to make sure the client has access to this scope */
  log({
    title: 'Verify Scope',
    parameters: [
      { name: 'token', value: token },
      { name: 'scope', value: scope },
    ],
  })
  const userHasAccess = true  // return true if this user / client combo has access to this resource
  return new Promise(resolve => resolve(userHasAccess))
}



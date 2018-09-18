import auth0 from "auth0-js";
import autoBind from "auto-bind";
import { AUTH_CONFIG } from "@/config/auth0-variables";
import { isEmptyObject } from "@/lib/utils";

export default class AuthService {
  constructor() {
    autoBind(this);
  }

  webAuth = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: "code token id_token",
    scope: "openid profile email"
  });

  login(email, password) {
    this.webAuth.login(
      {
        email: email,
        password: password
      },
      (err, response) => {
        console.error(err);
        console.error(response);
      }
    );
  }

  loginWithFacebook() {
    this.webAuth.authorize({ connection: "facebook" });
  }

  logout(returnTo) {
    this.webAuth.logout({
      returnTo: returnTo
    });
  }

  checkSession(callback) {
    this.webAuth.checkSession({}, (err, authResult) => {
      if (err) {
        callback(err);
        return;
      }
      callback(authResult);
    });
  }

  parseHash(hash, callback) {
    if (hash === null || isEmptyObject(hash)) {
      callback({});
      return;
    }

    this.webAuth.parseHash({ hash: hash }, (err, authResult) => {
      if (err) {
        callback(err);
        return;
      }

      this.webAuth.client.userInfo(authResult.accessToken, (err, user) => {
        if (err) {
          callback(err);
          return;
        }
        callback(user);
      });
    });
  }
}

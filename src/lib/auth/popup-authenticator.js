import autoBind from "auto-bind";

export default class PopupAuthenticator {
  constructor(options) {
    const _window = options.window || window;
    const defaultCallback = event => console.log(event);

    this.callback = options.callback || defaultCallback;
    this.redirectUri = options.redirectUri || _window.location.origin;
    this.domain = options.domain;
    this.clientId = options.clientId;

    this._popup = _window.open(
      "",
      "",
      "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=800,top=" +
        (screen.height - 400) +
        ",left=" +
        (screen.width - 840)
    );

    const auth0Script = this._popup.document.createElement("script");
    auth0Script.src = "https://cdn.auth0.com/js/auth0/9.5.1/auth0.min.js";
    this._popup.document.head.appendChild(auth0Script);

    const script = this._popup.document.createElement("script");
    script.innerHTML = `
      (function waitForAuth0() {
        if(typeof auth0 !== "undefined") {
          var webAuth = new auth0.WebAuth({
            domain: "${this.domain}",
            clientID: "${this.clientId}",
            redirectUri: "${this.redirectUri}",
            responseType: "code token id_token",
            scope: "openid profile email"
          });
          webAuth.authorize({ connection: "facebook" });
        } else {
          console.log("waiting for auth0");
          setTimeout(waitForAuth0, 250);
        }
      })();
    `;
    this._popup.document.head.appendChild(script);

    const callbackListener = event => {
      if (event.origin !== _window.location.origin) return;
      if (event.data && event.data.type !== "authorization_response") return;
      if (event.data && event.data.response) {
        this.callback(event.data.response);
        _window.removeEventListener("message", callbackListener);
      }
    };
    _window.addEventListener("message", callbackListener, false);

    autoBind(this);
  }

  destroy() {
    console.log(this._popup.closed);
    if (!this._popup.closed) {
      this._popup.close();
    }
  }
}

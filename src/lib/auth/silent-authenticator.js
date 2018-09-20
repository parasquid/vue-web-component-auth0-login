import autoBind from "auto-bind";
import "srcdoc-polyfill";

export default class SilentAuthentication {
  constructor(options) {
    const _window = options.window || window;
    const defaultCallback = event => console.log(event);

    this.callback = options.callback || defaultCallback;
    this.email = options.email || "";
    this.password = options.password || "";
    this.redirectUri = options.redirectUri || _window.location.origin;
    this.domain = options.domain;
    this.clientId = options.clientId;

    this._iframe = _window.document.createElement("iframe");
    this._setupIframe(this._iframe);

    _window.document.body.appendChild(this._iframe);
    this._iframe.srcdoc = `
    <html>
      <head>
        <script src="https://cdn.auth0.com/js/auth0/9.5.1/auth0.min.js"></script>
        <script>
          var webAuth = new auth0.WebAuth({
            domain: "${this.domain}",
            clientID: "${this.clientId}",
            redirectUri: "${this.redirectUri}",
            responseType: "code token id_token",
            scope: "openid profile email"
          });
          webAuth.login({
            username: "${this.email}",
            password: "${this.password}"
          }, function(err, response) {
            console.error(err);
          });
        </script>
      </head>
      <body>
        <h1>Hello</h1>
      </body>
    </html>`;

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
    if (this._iframe.parentNode) {
      this._iframe.parentNode.removeChild(this._iframe);
    }
  }

  _setupIframe(iframe) {
    iframe.style.display = "none";
    iframe.style.width = "1000px";
    iframe.style.height = "1000px";
    return iframe;
  }
}

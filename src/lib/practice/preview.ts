/**
 * Builds an isolated, sandboxed HTML document string with Content Security Policy
 * and console interception bridge.
 */
export function buildSandboxedPreviewDocument(
  html: string,
  css: string,
  javascript: string,
): string {
  const safeHtml = html || "";
  const safeCss = css || "";
  const safeJs = javascript || "";

  // The console bridge intercepts log, warn, error, and unhandled exceptions
  // and communicates them back to the parent window via postMessage.
  const bridgeScript = `
    (function() {
      function sendToParent(type, args) {
        try {
          var formatted = Array.prototype.slice.call(args).map(function(arg) {
            if (arg === null) return "null";
            if (arg === undefined) return "undefined";
            if (typeof arg === "object") {
              try {
                return JSON.stringify(arg, null, 2);
              } catch(e) {
                return Object.prototype.toString.call(arg);
              }
            }
            return String(arg);
          }).join(" ");

          window.parent.postMessage({
            type: "MERITLOOM_SANDBOX_CONSOLE",
            level: type,
            content: formatted,
            timestamp: Date.now()
          }, "*");
        } catch(e) {}
      }

      var origLog = console.log;
      var origWarn = console.warn;
      var origError = console.error;
      var origInfo = console.info;

      console.log = function() {
        sendToParent("log", arguments);
        if (origLog) origLog.apply(console, arguments);
      };

      console.warn = function() {
        sendToParent("warn", arguments);
        if (origWarn) origWarn.apply(console, arguments);
      };

      console.error = function() {
        sendToParent("error", arguments);
        if (origError) origError.apply(console, arguments);
      };

      console.info = function() {
        sendToParent("info", arguments);
        if (origInfo) origInfo.apply(console, arguments);
      };

      window.onerror = function(message, source, lineno, colno, error) {
        var errorMsg = message || (error && error.message) || "Runtime error in practice code.";
        sendToParent("error", [errorMsg]);
        return true;
      };
    })();
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob: https:; connect-src 'none'; font-src data:; media-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none';">
  <title>Practice Preview</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #172033;
      background-color: #ffffff;
      line-height: 1.5;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    ${safeCss}
  </style>
</head>
<body>
  ${safeHtml}

  <script>
    ${bridgeScript}
  </script>

  <script>
    try {
      ${safeJs}
    } catch(err) {
      console.error(err && err.message ? err.message : String(err));
    }
  </script>
</body>
</html>`;
}

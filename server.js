const axios = require("axios");
const express = require("express");
const next = require("next");
const request = require("request");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const querystring = require("querystring");

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  server.set("trust proxy", 1);

  server.use(
    cookieSession({
      name: "xsightin-session",
      keys: ["XSIGHTIN_KEY_09ASUD09F0SDF"]
    })
  );

  server.post("/login", (req, res) => {
    req.session.jwt =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMWI3ZDVlYjAtYjlhOS0xMWU5LWEyYTMtMmEyYWUyZGJjY2U0IiwiZW1haWwiOiJzYW5nbnQ4QGZzb2Z0LmNvbS52biIsImV4cCI6MTU4MDk1ODg3MCwiY3JlYXRlZF9hdCI6MTU4MDM1NDA3MH0.xZBCvEczbtRd-pvEjX2hehTWdpVaMSRGwB5h7GjzejI";
    res.status(200).send();
  });

  server.get("/session_debug", (req, res) => {
    res.send(req.session.jwt);
  });

  server.get("/oauth/mailchimp", (req, res) => {
    console.log(`req query`, req.query);

    axios
      .post(
        "https://login.mailchimp.com/oauth2/token",
        querystring.stringify({
          grant_type: "authorization_code",
          client_id: "781715608741",
          client_secret: "c87b89532e7ed7c9eeec4a5a4e0a2a8cc36220f9ccc07f79d3",
          redirect_uri: "http://127.0.0.1:3000/oauth/mailchimp",
          code: req.query.code
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      .then(function(response) {
        console.log(response);
        // res.status(200).send({ response: response });
      })
      .catch(error => {
        console.log(`error`, error);
        // res.status(300).send(`error`, error);
      });
  });

  server.post("/oauth/mailchimp/actions/test", (req, res) => {
    request({
      method: "POST",
      url: "https://login.mailchimp.com/oauth2/token",
      body: {
        grant_type: "authorization_code",
        client_id: "781715608741",
        client_secret: "c87b89532e7ed7c9eeec4a5a4e0a2a8cc36220f9ccc07f79d3",
        redirect_uri: "http://127.0.0.1:3000/oauth/mailchimp",
        code: ""
      },
      json: true
    })
      .on("error", err => {})
      .pipe(res);
  });

  server.all("/api/*", (req, res) => {
    const config = {
      method: req.method,
      url: `http://localhost:8080/${req.params[0]}`,
      qs: req.query,
      qsStringifyOptions: { arrayFormat: "repeat" },
      body: req.body,
      json: true,
      // headers: req.headers,
      headers: {
        Authorization: `Bearer ${req.session.jwt}`
      }
    };
    request(config)
      .on("error", err => {
        // logger.log({
        //   level: 'error',
        //   message: `${err.errno} ${err.address}:${err.port}`,
        // })
      })
      .pipe(res);
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

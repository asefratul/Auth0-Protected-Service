const express = require("express");
const app = express();
const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");
const cors = require("cors");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://dev-bloc12-exchange.com/api/v1/",
  issuerBaseURL: `https://dev-bloc12-exchange.eu.auth0.com/`,
});

app.use(cors({ origin: "*" }));

// This route doesn't need authentication
app.get("/api/public", function (req, res) {
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication
app.get("/api/private", checkJwt, function (req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});

const checkScopes = requiredScopes("read:messages");

app.get("/api/private-scoped", checkJwt, checkScopes, function (req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
  });
});

app.listen(3000, function () {
  console.log("Listening on http://localhost:3000");
});

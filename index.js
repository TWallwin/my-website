/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const cons = require("consolidate");
/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */
app.engine("html", cons.swig);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "html");
/**
 * Routes Definitions
 */

app.all("/*", (req, res) => {
  res.sendFile("./index.html", { root: "public" });
});

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

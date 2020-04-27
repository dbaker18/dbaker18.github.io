// These are our required libraries to make the server work.

import express from "express";
import fetch from "node-fetch";

// const sqlite3 = require('sqlite3').verbose(); // We're including a server-side version of SQLite, the in-memory SQL server.
// const open = require(sqlite).open; // We're including a server-side version of SQLite, the in-memory SQL server.

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import writeUser from "./libraries/writeuser";

const dbSettings = {
  filename: "./tmp/database.db",
  driver: sqlite3.Database,
};

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

  function getResult(req, res) {

    // processDataForFrontEnd(req, res)
    (async () => {
      const db = await open(dbSettings);
      const result = await db.all("SELECT * FROM user");
      console.log("Expected result", result);
      res.json(result);
    })();
  }

  function putResult (req, res) {
    console.log("/api post request", req.body);
    if (!req.body.name) {
      console.log(req.body);
      res.status("418").send("something went wrong, additionally i am a teapot");
    } else {
      writeUser(req.body.name, dbSettings)
      .then((result) => {
        console.log(result);
        res.send("you successed!"); // simple mode
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  //CODE HELP FROM CLASSMATE
  app
  .route("/api")
  .get((req, res) => {
    getResult(req, res);
  })
  .put((req, res) => {
    putResult(req, res);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

const express = require("express");
const app = express();
const db = require("./db");

console.log(db);

db.getAllActors()
    .then(({ rows }) => {
        console.log("rows: ", rows);
    })
    .catch((err) => console.log(err));

db.addActor("Jay Chou", 42, 0)
    .then(({ rows }) => {
        console.log("rows: ", rows);
    })
    .catch((err) => console.log(err));

app.listen(8080, () => console.log("Petition up and running on PORT 8080..."));

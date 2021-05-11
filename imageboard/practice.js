const db = require("./db_imageboard");
db.getNewUpload(10).then(function (dbResponse) {
    let { rows } = dbResponse;
    //console.log(rows[0]);
    image.unshift(rows[0]);
    console.log(image);
});
let image = [];

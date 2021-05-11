const express = require("express");
const app = express();
const db = require("./db_imageboard");
const s3 = require("./s3");
app.use(express.static("public"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        //this is in mb
        fileSize: 2097152,
    },
});

//////////////////////////////DON'T TOUCH ABOVE/////////////////////

app.use(express.json());
app.get("/images", (req, res) => {
    //no touchy
    console.log("get images!");
    db.getAllDetails().then(function (dbResponse) {
        let { rows } = dbResponse;
        let images = rows;
        res.json(images);
    });
});

app.get("/images/:id", (req, res) => {
    //no touchy this gives you one image
    const imgId = req.params.id;
    console.log("imgId:", imgId);
    db.getImage(imgId).then(function (dbResponse) {
        let { rows } = dbResponse;
        res.json({
            image: rows[0],
            success: true,
        });
    });
});

app.get("/next/:id", (req, res) => {
    //no touchy
    const lastId = req.params.id;
    db.getMoreImages(lastId).then(function (dbResponse) {
        let { rows } = dbResponse;
        if (rows.length < 6) {
            console.log("Running out of images!");
            res.json({
                images: rows,
                more: false,
            });
        } else {
            console.log("length", rows.length);
            res.json({
                images: rows,
                more: true,
            });
        }
    });
});

///need to make get
app.get("/get-comments/:id", (req, res) => {
    console.log("/get-comments/:id", req.params.id);
    const imgId = req.params.id;
    db.getComments(imgId).then(function (dbResponse) {
        let { rows } = dbResponse;
        console.log(rows);
        res.json({
            comments: rows,
            success: true,
        });
    });
});

///need to make post////////////////////////////
app.post("/comment", (req, res) => {
    console.log("POST comment...");
    const { id, comment, author } = req.body;
    db.addComment(id, comment, author).then(function (dbResponse) {
        let { rows } = dbResponse;
        res.json({
            comments: rows[0],
            success: true,
        });
    });
});

//////////////////////////////////////////////
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    //no touchy
    console.log("hit the post route....");
    const { filename } = req.file;
    const { title, description, username } = req.body;
    if (req.file) {
        db.insertUpload(username, title, description, filename).then(function (
            dbResponse
        ) {
            let { rows } = dbResponse;
            res.json({
                image: rows[0],
                success: true,
            });
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("Imageboard up and running on PORT8080..."));

//DON'T TOUCHE THIS
//MIDDLEWARE FUNCTION

const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in production the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

//object is a filename ares call keys
exports.upload = (req, res, next) => {
    console.log(req);
    if (!req.file) {
        console.log("multer fail");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(function () {
            //makes the obj into a promise
            next();
            fs.unlink(path, () => {});
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(500);
        });
};

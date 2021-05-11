const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getAllDetails = () => {
    const q = `
    SELECT * 
    FROM images
    ORDER BY id DESC
    LIMIT 6;
    `;
    return db.query(q);
};

module.exports.insertUpload = (username, title, description, file) => {
    url = "https://s3.amazonaws.com/spicedling/" + file;
    const q = `
    INSERT INTO images (url, username, title, description)
    VALUES ( $1, $2 , $3, $4)
    RETURNING *;
    `;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getImage = (id) => {
    const q = `
    SELECT *
    FROM images WHERE id=$1;
    `;
    const params = [id];
    return db.query(q, params);
};

/////////////////BELOW MAY NEED ADJUSTING////////////////

module.exports.getComments = (imgId) => {
    const q = `
    SELECT *
    FROM comments 
    WHERE img_id = $1
    `;
    const params = [imgId];
    return db.query(q, params);
};

module.exports.addComment = (imgId, comment, author) => {
    const q = `
    INSERT INTO comments (img_id, comment, author)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const params = [imgId, comment, author];
    return db.query(q, params);
};
/////////////////ABOVE MAY NEED ADJUSTING////////////////

module.exports.smallestId = () => {
    const q = `
    SELECT id
    FROM images
    LIMIT 1;
    `;
    return db.query(q);
};

//Lastid is lowest id on screen
exports.getMoreImages = (lastId) => {
    const q = `SELECT * 
    FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 6;
    `;
    const params = [lastId];
    return db.query(q, params);
};

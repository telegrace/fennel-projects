//cnnection postgres db

const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/actors");

module.exports.getAllActors = () => {
    const q = `SELECT * FROM actors`;
    return db.query(q);
};

module.exports.addActor = (name, age, oscars) => {
    const q = `
    INSERT INTO actors (name, age, oscars) 
    values ($1, $2, $3)
    RETURNING id`;
    const params = [name, age, oscars];
    return db.query(q, params);
};

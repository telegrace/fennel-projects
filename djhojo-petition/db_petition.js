const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);
const { genSalt, hash, saltRounds } = require("bcryptjs");

// database is petition, tables are users(email,pw), user_profiles(), signature
// let password = "one2three4";

let password_hash; //do these need to be declared elsewhere?

//I can store what they return into a variable ?
module.exports.registerUser = (name, surname, email, password) => {
    genSalt(saltRounds, function (err, salt) {
        if (err) {
            console.log("registerUser err: ", err);
        } else {
            hash(password, salt, function (err, hash) {
                if (err) {
                    console.log("registerUser Hash error: ", err);
                } else {
                    password_hash = hash;
                    const q = `INSERT INTO users (name, surname, email, password_hash ) 
            values ($1, $2, $3, $4)
            RETURNING id`; //use this for cookies
                    const params = [name, surname, email, password_hash];
                    return Promise.resolve(db.query(q, params));
                }
            });
        }
    });
};

module.exports.getId = (email) => {
    const q = `
    SELECT id FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};
module.exports.existingEmail = (email) => {
    const q = `
    SELECT email FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

//login user, email address and password, need to hash password
module.exports.loginUser = (email) => {
    const q = `
    SELECT * FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getName = (user_id) => {
    const q = `
    SELECT name FROM users WHERE id = $1`;
    const params = [user_id];
    return db.query(q, params);
};

//add age, city and website, user_id is var and user_id is column name
module.exports.addProfile = (user_id, age, city, website) => {
    const q = `
    INSERT INTO user_profiles (user_id, age, city, website)
    VALUES ( $1, $2 , $3, $4);`;
    const params = [user_id, age, city, website];
    return db.query(q, params);
};

module.exports.addSignature = (user_id, signature) => {
    const q = `
    INSERT INTO signatures (user_id, signature)
    VALUES ( $1, $2 )
    RETURNING signature;`;
    const params = [user_id, signature];
    return db.query(q, params);
};

module.exports.getSignature = (user_id) => {
    const q = `
    SELECT signature FROM signatures WHERE user_id = $1`;
    const params = [user_id];
    return db.query(q, params);
};

module.exports.deleteSignature = (user_id) => {
    const q = `
    DELETE FROM signatures WHERE user_id = $1;`;
    const params = [user_id];
    return db.query(q, params);
};

module.exports.getTotalUsers = () => {
    const q = `SELECT count(id) FROM users;`;
    return db.query(q);
};

//get all info need to join user_profiles AND users
//full name, age, location and email
module.exports.getAllDetails = () => {
    const q = `SELECT name, surname, age, city, website FROM user_profiles 
    JOIN users ON user_profiles.id = users.id;`;
    return db.query(q);
};

//by city! need to case proof this!
module.exports.getSameCity = (city) => {
    const q = `SELECT name, surname, age, city, website 
    FROM user_profiles 
    LEFT JOIN users 
    ON user_profiles.id = users.id 
    WHERE city = $1;`;
    const params = [city];
    return db.query(q, params);
};

module.exports.getProfile = (user_id) => {
    const q = `SELECT name, surname, email, age, city, website 
    FROM users 
    LEFT JOIN user_profiles
    ON user_profiles.id = users.id 
    WHERE users.id = $1;`;
    const params = [user_id];
    return db.query(q, params);
};

module.exports.updateProfile = (user_id, age, city, website) => {
    const q = `INSERT INTO user_profiles (user_id, age, city, website)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET (age, city, website) = ($2, $3, $4);`;
    const params = [user_id, age, city, website];
    return Promise.resolve(db.query(q, params));
};

module.exports.updateUser = (user_id, name, surname, email) => {
    const q = `UPDATE users 
    SET (name, surname, email) = ($2, $3, $4)
    WHERE id = $1;`;
    const params = [user_id, name, surname, email];
    return db.query(q, params);
};

module.exports.updateUserAndPassword = (
    user_id,
    name,
    surname,
    email,
    password
) => {
    genSalt(saltRounds, function (err, salt) {
        if (err) {
            console.log("registerUser err: ", err);
        } else {
            hash(password, salt, function (err, hash) {
                if (err) {
                    console.log("registerUser Hash error: ", err);
                } else {
                    password_hash = hash;
                    const q = `
                        UPDATE users 
                        SET (name, surname, email, password_hash) = ($2, $3, $4, $5)
                        WHERE id = $1;`;
                    const params = [
                        user_id,
                        name,
                        surname,
                        email,
                        password_hash,
                    ];
                    return Promise.resolve(db.query(q, params));
                }
            });
        }
    });
};

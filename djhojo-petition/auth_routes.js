const express = require("express");
const router = express.Router();
const db = require("./db_petition"); //don't {}
const { requireLoggedOutUser } = require("./middleware");
const { compare } = require("bcryptjs");

// router.use(requireLoggedOutUser);
router.get("/", (req, res) => {
    res.redirect("/register"), console.log(req.session.userId);
});
router.get("/register", requireLoggedOutUser, (req, res) => {
    res.render("register", { csrfToken: req.csrfToken() });
});

router.post("/register", (req, res) => {
    // there will always be the obj with name, surname, email, password
    const { name, surname, email, password } = req.body;
    let complete = true;
    Object.values(req.body).forEach((val) => {
        if (val.length === 0) {
            complete = false;
        }
    });
    if (complete) {
        let alrdyEmail;
        db.existingEmail(email).then(function (dbReponse) {
            let { rows } = dbReponse;
            if (!Array.isArray(rows) || !rows.length) {
                db.registerUser(name, surname, email, password);
                res.redirect("login");
            } else {
                alrdyEmail = rows[0].email;
                if (email === alrdyEmail) {
                    res.render("register", {
                        csrfToken: req.csrfToken(),
                        error: true,
                        message: " (⊙▂⊙)  Email already taken!  (⊙▂⊙) ",
                    });
                } else {
                    console.log("Error POST register: ", err);
                    res.render("register", {
                        error: true,
                        message: " ( ˘︹˘ ) Please try again! ( ˘︹˘ ) ",
                    });
                }
            }
        });
    } else {
        res.render("register", {
            csrfToken: req.csrfToken(),
            error: true,
            message: " (ಠ_ಠ)  Please fill in everything  (ಠ_ಠ) ",
        });
    }
});

router.get("/login", requireLoggedOutUser, (req, res) => {
    res.render("login", {
        csrfToken: req.csrfToken(),
    });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email == "" || password == "") {
        res.render("login", {
            csrfToken: req.csrfToken(),
            error: true,
            message: "(!!˚☐˚)/ Fill in your email and password \\(˚☐˚!!) ",
        });
    } else {
        db.loginUser(email).then((dbReponse) => {
            let { rows } = dbReponse;
            if (!Array.isArray(rows) || !rows.length) {
                res.render("login", {
                    csrfToken: req.csrfToken(),
                    error: true,
                    message: "(T⌓T)  Login Error! Please try again  (T⌓T)",
                });
            } else {
                let hash = rows[0].password_hash;
                compare(password, hash, function (err, isMatch) {
                    if (err) {
                        console.log("loginUser err: ", err);
                    } else if (!isMatch) {
                        console.log("Password doesn't match!");
                        res.render("login", {
                            csrfToken: req.csrfToken(),
                            error: true,
                            message:
                                "(T⌓T)  Login Error! Please try again  (T⌓T)",
                        });
                    } else {
                        req.session.userId = rows[0].id;
                        console.log("Password matches!");
                        res.redirect("profile");
                    }
                });
            }
        });
    }
});

exports.router = router;

//to log out req.session = null

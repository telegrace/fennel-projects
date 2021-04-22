const express = require("express");
const app = express();
exports.app = app;
const hb = require("express-handlebars");
const cookieSession = require("cookie-session"); //from code along
const db = require("./db_petition"); //don't {}
const csrf = require("csurf");
const authRoutes = require("./auth_routes");
const {
    requireLoggedInUser,
    requireNoSignature,
    requireSignature,
} = require("./middleware");

app.use(express.static("./public"));
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use((req, res, next) => {
    console.log(`MIDDLEWARE LOG : ${req.method} to ${req.url} route`);
    next();
});

app.use(
    cookieSession({
        secret: `You're a star!`,
        maxAge: 1000 * 60 * 60 * 24 * 14, //two weeks
    })
);
app.use(express.urlencoded({ extended: false }));

app.use(csrf());
app.use(authRoutes.router);

app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(requireLoggedInUser);

app.get("/profile", (req, res) => {
    res.render("profile", { csrfToken: req.csrfToken() });
});

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("login", { csrfToken: req.csrfToken() });
});

app.post("/profile", (req, res) => {
    console.log("req.session.userId: ", req.session.userId);

    let { age, city, website } = req.body;
    if (age === "") {
        age = 0;
    }
    if (website.startsWith("http://") || website.startsWith("https://")) {
        db.addProfile(req.session.userId, age, city, website).then(
            res.redirect("/signature")
        );
    } else {
        website = "https://" + website;
        db.addProfile(req.session.userId, age, city, website).then(
            res.redirect("/signature")
        );
    }
});

app.get("/edit", requireLoggedInUser, (req, res) => {
    db.getProfile(req.session.userId).then(function (dbReponse) {
        let { rows } = dbReponse;
        res.render("edit", {
            name: rows[0].name,
            surname: rows[0].surname,
            email: rows[0].email,
            age: rows[0].age,
            city: rows[0].city,
            website: rows[0].website,
            csrfToken: req.csrfToken(),
        });
    });
});

app.post("/edit", (req, res) => {
    const { name, surname, email, password, age, city, website } = req.body;
    //if password has been changed
    if (password !== "") {
        db.updateProfile(req.session.userId, age, city, website).then(
            function () {
                db.updateUserAndPassword = (req.session.userId,
                name,
                surname,
                email,
                password).then(function () {
                    document.cookie = "userId=; expires=0;";
                    res.get("/login", requireLoggedOutUser, (req, res) => {
                        res.render("edit", { csrfToken: req.csrfToken() });
                    });
                });
            }
        );
    } else {
        db.updateProfile(req.session.userId, age, city, website).then(
            function () {
                db.updateUser(req.session.userId, name, surname, email).then(
                    function () {
                        res.redirect("signed");
                    }
                );
            }
        );
    }
});

app.get("/signature", requireNoSignature, (req, res) => {
    //if has cookie res.redirect("signed");
    res.render("signature", { csrfToken: req.csrfToken() });
});

app.post("/signature", (req, res) => {
    const { signature } = req.body;
    if (signature) {
        db.addSignature(req.session.userId, signature);
        req.session.signatureId = req.session.userId;
        res.redirect("signed");
    } else {
        res.render("signature", {
            csrfToken: req.csrfToken(),
            error: true,
            message: " (◕︵◕)  Please sign!  (◕︵◕) ",
        });
    }
});

//signed will be a thank you page, POST will be to delete signature and edit profile will link to edit
app.get("/signed", requireSignature, (req, res) => {
    db.getName(req.session.userId).then(function (dbReponse) {
        let { rows } = dbReponse;
        let name = rows[0].name;
        db.getSignature(req.session.userId).then(function (dbReponse) {
            let { rows } = dbReponse;
            console.log(rows);

            let signature = dbReponse.rows[0].signature;
            db.getTotalUsers().then(function (dbReponse) {
                let totalUsers = dbReponse.rows[0].count;
                res.render("signed", {
                    csrfToken: req.csrfToken(),
                    thankyou: true,
                    message: `Thanks for signing, DJ`,
                    name: name,
                    signature: signature,
                    number: totalUsers,
                });
            });
        });
    });
});

app.post("/signed", (req, res) => {
    db.deleteSignature(req.session.userId).then(function () {});
    delete req.session.signatureId;
    res.redirect("/signature");
});

//signers no need to post anything, need to grab name though
app.get("/signers", requireLoggedInUser, (req, res) => {
    db.getAllDetails().then(function (dbResponse) {
        let { rows } = dbResponse;
        res.render("signers", {
            signers: rows,
        });
    });
});

app.get("/signers/city/:city", requireLoggedInUser, (req, res) => {
    const { city } = req.params;
    console.log(city);
    db.getSameCity(city).then(function (dbResponse) {
        let { rows } = dbResponse;
        res.render("signers", {
            signers: rows,
        });
    });
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("Petition up and running on PORT8080 <3")
    );
}

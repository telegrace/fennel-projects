exports.requireLoggedInUser = (req, res, next) => {
    if (!req.session.userId) {
        // this means the user is NOT logged in
        return res.redirect(302, "/register");
    }
    next();
};

// logged-in users should be redirected away from those register and login
exports.requireLoggedOutUser = (req, res, next) => {
    if (req.session.userId) {
        // goes to signature to sign
        return res.redirect(302, "/signature");
    }
    next();
};

//users with
exports.requireNoSignature = (req, res, next) => {
    if (req.session.signatureId) {
        return res.redirect(302, "/signed");
    }
    next();
};

exports.requireSignature = (req, res, next) => {
    if (!req.session.signatureId) {
        return res.redirect(302, "/signature");
    }
    next();
};

/*
REDIRECTS CAN ONLY TAKE STATUS AND PATH
express deprecated res.redirect(url, status): Use res.redirect(status, url) instead middleware.js:26:20
*/

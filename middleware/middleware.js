const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let notFoundPage = (req, res) => {
    res.render('404');
};

let internalError = (req, res) => {
    res.render('500');
};

let sessionChecker = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    }
    next();
};

let setHeaderFunc = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
};

exports.notFoundPage = notFoundPage;
exports.internalError = internalError;
exports.sessionChecker = sessionChecker;
exports.setHeaderFunc = setHeaderFunc;
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let loginFunc = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    const formData = {
      username: username,
      password: password
    };

    const options = {
        url: process.env.SERVER_ADD + '/api/auth/login',
        form: formData,
        method: 'POST',
        // strictSSL: false,
        // secureProtocol: 'TLSv1_method'
    };

    request(options, (err, response, body) => {
        if(err){
            res.render('login', {content: null, error: err});
        }
        else{
            let result = JSON.parse(body);

            if(result.success === false){
                res.render('login', {content: null, error: 'Username or Password does not exist!!!'});
            }
            else{
                req.session.username = result.name;
                req.session.token = result.token;
                req.session.priv = result.isRoot;
                res.redirect('/');
                // res.end();
            }
        }
    });
};

let logoutFunc = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/login');
};

exports.loginFunc = loginFunc;
exports.logoutFunc = logoutFunc;
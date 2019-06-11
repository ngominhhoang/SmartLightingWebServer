const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let getUserProfile = (req, res) => {
    let token = req.session.token;

    const options = {
        url:  process.env.SERVER_ADD + '/api/users?token=' + token,
        method: 'GET'
    };

    request(options, (err, response, body) => {
        if(err){
            res.render('profile', {
                pageTitle: 'Trang cá nhân | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                error: err,
                data: null
            })
        }
        else{
            let data = JSON.parse(body);

            res.render('profile', {
                pageTitle: 'Trang cá nhân | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                error: null,
                data
            });
        }
    })
};

let changePass = (req, res) => {
    let old_password = req.body.old_password;
    let new_password = req.body.new_password;
    let username = req.body._username;

    const formData = {
        username: username,
        old_password: old_password,
        new_password: new_password
    };

    const options = {
        url: process.env.SERVER_ADD + '/api/users?token=' + token,
        method: 'POST',
        form: formData

    };

    request(options, (err, response, body) => {
        if(err){
            res.render('profile', {
                pageTitle: 'Trang cá nhân | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                error: err,
                data: null
            })
        }
        else{
            let data = JSON.parse(body);
            res.render('profile', {
                pageTitle: 'Trang cá nhân | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                error: null,
                data
            })
        }
    })
};

let getListUser = (req, res) => {
    let token = req.session.token;

    if(req.session.priv === 'T'){
        const options = {
            url: process.env.SERVER_ADD + '/api/users/list_user?token=' + token,
            method: 'GET'
        };

        request(options, (err, response, body) => {
           if(err){
               res.render('list_user', {
                   pageTitle: 'Danh sách người dùng | Smart Lighting',
                   username: req.session.username,
                   key: req.session.token,
                   error: err,
                   data: null
               });
           }
           else{
               let data = JSON.parse(body);

               res.render('list_user', {
                   pageTitle: 'Danh sách người dùng | Smart Lighting',
                   username: req.session.username,
                   key: req.session.token,
                   error: null,
                   data
               })
           }
        });
    }
    else{
        res.render('404');
    }

};

exports.getUserProfile = getUserProfile;
exports.changePass = changePass;
exports.getListUser = getListUser;
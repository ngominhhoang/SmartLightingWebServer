const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let getHomeList = (req, res) => {
    let username = req.body.chooseUsername;
    let token = req.session.token;

    console.log(username);

    let formData = {
        usernameToGet: username
    };

    const options = {
        url: process.env.SERVER_ADD + '/api/data/admin_gethomelist?token=' + token,
        form: formData,
        method: 'POST'
    };

    request(options, (err, response, body) => {
        if(err){
            res.render('list_home', {
                pageTitle: 'Danh sách nhà | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                error: err,
                data: null
            });
        }
        else{
            let data = JSON.parse(body);

            res.render('list_home', {
                pageTitle: 'Danh sách nhà | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                error: null,
                data
            });
        }
    })
};

let getRoomList = (req, res) => {
    let token = req.session.token;
    let home_id = req.body.chooseHome;

    const options = {
        url: process.env.SERVER_ADD + '/api/data/home/' + home_id +'?token=' + token,
        method: 'GET'
    };

    request(options, (err, response, body) => {
        if(err){
            res.render('list_room', {
                username: req.session.username,
                pageTitle: 'Quản lý phòng | Smart Lighting',
                key: req.session.token,
                error: err,
                data: null,
                home_id: null
            });
        }
        else{
            let data = JSON.parse(body);

            res.render('list_room', {
                username: req.session.username,
                pageTitle: 'Quản lý phòng | Smart Lighting',
                key: req.session.token,
                error: err,
                data,
                home_id: home_id
            })
        }
    })
};

let addHome = (req, res) => {
    let token = req.session.token;
    let usernameToAdd = req.body.chooseUsername;

    let formData = {
        house_owner: usernameToAdd
    };

    const options = {
        url: process.env.SERVER_ADD + '/api/modify/add_home?token=' + token,
        form: formData,
        method: 'POST'
    };

    request(options, (err, response, body) => {
        if(err){
            res.render('list_home', {
                username: req.session.username,
                pageTitle: 'Quản lý nhà | Smart Lighting',
                key: req.session.token,
                error: err,
                data: null
            });
        }
        else{
            // const options = {
            //     url: 'https://' + process.env.SERVER_ADD + ':3000/api/data?token=' + token,
            //     method: 'GET'
            // };
            //
            // request(options, (err, response, body) => {
            //     if(err){
            //         res.render('list_home', {
            //             username: req.session.username,
            //             pageTitle: 'Quản lý nhà | Smart Lighting',
            //             key: req.session.token,
            //             error: err,
            //             data: null
            //         });
            //     }
            //     else{
            //         let data = JSON.parse(body);
            //
            //         res.render('list_home', {
            //             username: req.session.username,
            //             pageTitle: 'Quản lý nhà | Smart Lighting',
            //             key: req.session.token,
            //             error: err,
            //             data
            //         })
            //     }
            // });
            let formData = {
                usernameToGet: usernameToAdd
            };

            const options = {
                url:  process.env.SERVER_ADD + '/api/data/admin_gethomelist?token=' + token,
                form: formData,
                method: 'POST'
            };

            request(options, (err, response, body) => {
                if(err){
                    res.render('list_home', {
                        pageTitle: 'Quản lý nhà | Smart Lighting',
                        username: req.session.username,
                        key: req.session.token,
                        error: err,
                        data: null
                    });
                }
                else{
                    let data = JSON.parse(body);

                    res.render('list_home', {
                        pageTitle: 'Quản lý nhà | Smart Lighting',
                        username: req.session.username,
                        key: req.session.token,
                        error: null,
                        data
                    });
                }
            })
        }
    })
};

let addRoom = (req, res) => {
    let token = req.session.token;
    let room_name = req.body.getNewRoomName;
    let home_id = req.body.home_id;

    let formData = {
        home_id: home_id,
        room_name: room_name
    };

    const options = {
        url:  process.env.SERVER_ADD + '/api/modify/add_room?token=' + token,
        form: formData,
        method: 'POST'
    };

    request(options, (err, response, body) => {
        if(err){
            res.render('list_room', {
                username: req.session.username,
                pageTitle: 'Quản lý phòng | Smart Lighting',
                key: req.session.token,
                error: err,
                data: null,
                home_id: home_id
            });
        }
        else{
            const options = {
                url:  process.env.SERVER_ADD + '/api/data/home/' + home_id +'?token=' + token,
                method: 'GET'
            };

            request(options, (err, response, body) => {
                if(err){
                    res.render('list_room', {
                        username: req.session.username,
                        pageTitle: 'Quản lý phòng | Smart Lighting',
                        key: req.session.token,
                        error: err,
                        data: null,
                        home_id: home_id
                    });
                }
                else{
                    let data = JSON.parse(body);

                    res.render('list_room', {
                        username: req.session.username,
                        pageTitle: 'Quản lý phòng | Smart Lighting',
                        key: req.session.token,
                        error: err,
                        data,
                        home_id: home_id
                    })
                }
            });
        }
    })
};

let addNewUser = (req, res) => {
    let token = req.session.token;
    let username = req.body.username;
    let password = req.body.password;
    let fullname = req.body.fullname;
    let phone = req.body.phone_number;
    let email = req.body.email;
    let birthday = req.body.birthday;

    let formData = {
        username: username,
        password: password,
        fullname: fullname,
        phone_number: phone,
        email: email,
        birthday: birthday
    };

    const options = {
        url:  process.env.SERVER_ADD + '/api/auth/register',
        form: formData,
        method: 'POST'
    };

    request(options, (err, response, body) => {
        console.log(JSON.parse(body));
        if(err){
            res.render('list_user', {
                username: req.session.username,
                pageTitle: 'Quản lý người dùng | Smart Lighting',
                key: req.session.token,
                error: err,
                data: null
            });
        }
        else{
            if(req.session.priv === 'T'){
                const options = {
                    url:  process.env.SERVER_ADD + '/api/users/list_user?token=' + token,
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
        }
    })
};

exports.addHome = addHome;
exports.addRoom = addRoom;
exports.addNewUser = addNewUser;
exports.getRoomList = getRoomList;
exports.getHomeList = getHomeList;
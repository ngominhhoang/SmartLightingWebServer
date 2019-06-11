const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let loginView = (req, res) => {
    if(!req.session.token){
        res.render('login', {content: null, error: null});
    }
    else{
        res.redirect('/');
    }
};

let indexView = (req, res) => {
    let token = req.session.token;

    const options = {
        url: process.env.SERVER_ADD + '/api/users/info?token=' + token,
        method: 'GET'
    };

    request(options, (err, response, body) => {
       if(err){
           res.render('home', {
               username: req.session.username,
               pageTitle: 'Trang chủ | Smart Lighting',
               error: err,
               numberOfUser: null,
               numberOfHome: null,
               numberOfRoom: null,
               numberOfDevice: null,
               numberOfTurnOnLight: null,
               powerConsumption: null
           });
       }
       else{
           let data = JSON.parse(body);

           res.render('home', {
               username: req.session.username,
               pageTitle: 'Trang chủ | Smart Lighting',
               error: null,
               numberOfUser: data.numberOfUser,
               numberOfHome: data.numberOfHome,
               numberOfRoom: data.numberOfRoom,
               numberOfDevice: data.numberOfDevice,
               numberOfTurnOnLight: data.numberOfTurnOnLight,
               powerConsumption: data.powerConsumption
           });
       }
    });
};

let databaseView = (req, res) => {
    res.render('light', {
        pageTitle: 'Quản lý thiết bị | Smart Lighting',
        username: req.session.username,
        key: req.session.token,
        error: null,
        data: null,
        home_id: null,
        room_id: null
    });
};

let lightData = (req, res) => {
    res.render('light_data', {
        pageTitle: 'Dữ liệu đèn | Smart Lighting',
        username: req.session.username,
        key: req.session.token,
        error: null
    })
};

// let controlLight = (req, res) => {
//     res.render('control_light', {
//         pageTitle: 'Điều khiển đèn | Smart Lighting',
//         username: req.session.username,
//         key: req.session.token,
//         error: null
//     });
// };

let addDevice = (req, res) => {
    res.render('add_device', {
        pageTitle: 'Thêm đèn | Smart Lighting',
        username: req.session.username,
        key: req.session.token,
        error: null
    })
};

let list_home = (req, res) => {
    res.render('list_home', {
        username: req.session.username,
        pageTitle: 'Quản lý nhà | Smart Lighting',
        key: req.session.token,
        error: null,
        data: null
    });
};

let list_room = (req, res) => {
    res.render('list_room', {
        pageTitle: 'Quản lý phòng | Smart Lighting',
        username: req.session.username,
        key: req.session.token,
        error: null,
        data: null,
        home_id: null
    })
};

exports.loginView = loginView;
exports.indexView = indexView;
exports.databaseView = databaseView;
exports.lightData = lightData;
// exports.controlLight = controlLight;
exports.addDevice = addDevice;
exports.list_home = list_home;
exports.list_room = list_room;
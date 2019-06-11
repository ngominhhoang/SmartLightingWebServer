const express = require('express');
const router = express.Router();
const auth = require('../controller/auth.js');
const viewRender = require('../controller/renderView.js');
const middleware = require('../middleware/middleware.js');
const lightProcess = require('../controller/light.js');
const user = require('../controller/user.js');
const func = require('../controller/function.js');

/**
 * Login view
 */

router.get('/login', viewRender.loginView);

/**
 * Handle login route
 */

router.post('/login', auth.loginFunc);

/**
 * Homepage route
 */

router.get('/', middleware.sessionChecker, viewRender.indexView);

router.get('/home', middleware.sessionChecker, viewRender.indexView);

router.get('/light', middleware.sessionChecker,viewRender.databaseView);

router.get('/light_data', middleware.sessionChecker, viewRender.lightData);

router.get('/profile', middleware.sessionChecker, user.getUserProfile);

router.get('/list_user', middleware.sessionChecker, user.getListUser);

router.get('/list_home', middleware.sessionChecker, viewRender.list_home);

router.get('/list_room', middleware.sessionChecker, viewRender.list_room);

router.post('/getDeviceList', middleware.sessionChecker,lightProcess.getDeviceList);

router.post('/changePassword', middleware.sessionChecker, user.changePass);

router.post('/add_device', middleware.sessionChecker, lightProcess.addDevice);

router.post('/add_home', middleware.sessionChecker, func.addHome);

router.post('/add_room', middleware.sessionChecker, func.addRoom);

router.post('/getRoomList', middleware.sessionChecker, func.getRoomList);

router.post('/add_user', middleware.sessionChecker, func.addNewUser);

router.post('/getHomeList', middleware.sessionChecker, func.getHomeList);

router.post('/turnOnLight/home/:home_id/room/:room_id', middleware.sessionChecker, middleware.setHeaderFunc, lightProcess.turnOnLight);

router.post('/record',middleware.sessionChecker, lightProcess.handleRecord)
/**
 * logout route
 */

router.get('/logout', auth.logoutFunc);

module.exports = router;
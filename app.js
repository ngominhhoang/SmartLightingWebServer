const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const routes = require('./route/routes.js');
const middleware = require('./middleware/middleware.js');
const session = require('express-session');
const https = require('https');
const cookieParser = require('cookie-parser');

require('dotenv').config();

app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json({limit: '700mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '700mb' ,parameterLimit:700000}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(session({
    key: 'user_token',
    secret: 'iotlab2018',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    httpOnly: false,
    cookie: {
        maxAge: 6000000
    }
}));

let httpsSer = {};

if(process.env.NODE_ENV == 'production'){
    const fs = require('fs');
    /**
     * point to SSL Cert
     */
    const ssl_key = fs.readFileSync('/etc/letsencrypt/live/k61iotlab.ddns.net/privkey.pem');
    const ssl_cert = fs.readFileSync('/etc/letsencrypt/live/k61iotlab.ddns.net/cert.pem');
    const ca = fs.readFileSync('/etc/letsencrypt/live/k61iotlab.ddns.net/chain.pem');

    httpsSer = {
        key: ssl_key,
        cert: ssl_cert,
        ca: ca
    };
}

/**
 * Route
 */
app.use('/', routes);

/**
 * Middleware handle errors
 */
app.use(middleware.notFoundPage);
app.use(middleware.internalError);

/**
 * create server
 * @type {Server}
 */
if(process.env.NODE_ENV == 'development'){
    const httpServ = http.createServer(app);
    httpServ.listen(app.get('port'));
}

if(process.env.NODE_ENV == 'production'){
    http.createServer((req, res) => {
        res.writeHead(301, { "Location": "https://" + req.headers['host'].replace(8080,8081) + req.url });
        res.end();
    }).listen(8080);

    const httpsServ = https.createServer(httpsSer, app);
    httpsServ.listen(8081);
}
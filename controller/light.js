const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const addon = require('../build/Release/addon');
const fs = require("fs");
const WaveFile = require('wavefile');

var apigee = require('apigee-access');

//app.use(bodyParser.raw({ type: 'audio/wav',extended:true, limit: '50mb' }));

app.use(bodyParser.json({limit: '700mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '700mb' ,parameterLimit:700000}));

let handleRecord = (req, res) => {
    /*let base64String = 'data:audio/wav;base64,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';
    let base64audio = base64String.split(';base64,').pop();
    var buf = new Buffer(base64audio, 'base64');
    var wstream = fs.createWriteStream('audiofile.wav');
    wstream.write(buf)
    wstream.end();*/
    /*let formidable = require('formidable')
    let form = new formidable.IncomingForm();
    form.parse(req);
    form.on('file', function(name, file) {
        console.log(name)
        console.log(file)
    });*/
    var buf = new Buffer(req.body.blob, 'base64'); // decode
    console.log(req.body.blob)
    fs.writeFile("test.wav", buf, function(err) {
        if(err) {
            console.log("err", err);
            res.json({
                'success':false,
                'err':err
            })
        } else {
            const options = {
                url: 'http://localhost:8081/',
                method: 'GET'
            };

            request(options, (err, response, body) => {
                if(err){
                    res.json({
                        'success':false,
                        'err':err
                    })
                }
                else{
                    let data = JSON.parse(body);
                    console.log(data.transcription)
                    let text = data.transcription;
                    let s = text;
                    const fixPos = ['một','hai','ba','bốn','năm','sáu'];
                    const fixNumPos = ['1','2','3','4','5','6'];
                    let prefix = "vị trí"
                    let suffix = "mức độ"
                    var i = s.indexOf(prefix);
                    if (i >= 0) {
                        s = s.substring(i + prefix.length);
                        i = s.indexOf(suffix);
                        if (i >= 0) {
                            s = s.substring(0, i);
                            p = text.substring(i + suffix.length);
                            posArray = s.split(" ");
                            levelArray = p.split(" ");
                            pos = '';
                            for (let idx in posArray) {
                                if (fixPos.includes(posArray[idx])) {
                                    pos = fixNumPos[fixPos.indexOf(posArray[idx])];
                                    continue;
                                }
                                if (fixNumPos.includes(posArray[idx])) {
                                    pos = fixNumPos[fixNumPos.indexOf(posArray[idx])];
                                    continue;
                                }
                            }

                            level = '';
                            for (let idx in levelArray) {
                                if (!isNaN(levelArray[idx])) {
                                    level = levelArray[idx];
                                }
                            }
                            console.log(pos)
                            console.log(level)
                            if (pos == '' || level == '') {
                                res.json({
                                    'success':false,
                                    'err':'wrong command'
                                })
                            }
                                else {
                                    res.json({
                                        'success':true,
                                        'pos':pos,
                                        'level':level
                                    })
                            }
                        }
                            else {
                            res.json({
                                'success':false,
                                'err':'wrong command'
                            })
                        }
                    }
                        else {
                        res.json({
                            'success':false,
                            'err':'wrong command'
                        })
                    }
                }
            })
        }
    });
}


let getDeviceList = (req, res) => {
    let home_id = req.body.chooseHome;
    let room_id = req.body.chooseRoom;
    let token = req.session.token;
    let device_type = req.body.chooseType;

    const options = {
        url: process.env.SERVER_ADD + '/api/data/home/' + home_id + '/room/' + room_id + "/device_type/" + device_type + '?token=' + token,
        method: 'GET'
    };

    request(options, (err, response, body) => {
        if(err){
            res.render('light', {
                error: err,
                pageTitle: 'Quản lý thiết bị | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                data: null,
                home_id: null,
                room_id: null,
                device_type: null
            })
        }
        else{
            let data = JSON.parse(body);

            res.render('light', {
                error: null,
                pageTitle: 'Quản lý thiết bị | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                data,
                home_id: home_id,
                room_id: room_id,
                device_type: device_type
            })
        }
    })
};

let getDeviceParam = (req, res) => {
    let home_id = req.body.chooseHome;
    let room_id = req.body.chooseRoom;
    let device_id = req.body.chooseDevice;
    let token = req.session.token;
    let source = req.body.chooseType;

    const options = {
        url:  process.env.SERVER_ADD + '/api/data/home/' + home_id + '/room/' + room_id + '/device_type/lighting_device' + '/device_id/' + device_id + '/type/' + source + '?token=' + token,
        method: 'GET',
        // strictSSL: false,
        // secureProtocol: 'TLSv1_method'
    };

    request(options, (err, response, body) => {
        if(err){
            res.render('light', {
                error: err,
                pageTitle: 'Database | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                data: null
            })
        }
        else{
            let data = JSON.parse(body);

            console.log(data);
            res.render('light', {
                error: null,
                pageTitle: 'Database | Smart Lighting',
                username: req.session.username,
                key: req.session.token,
                data
            })
        }
    })
};

let addDevice = (req, res) => {
    let token = req.session.token;
    let home_id = req.body.chooseHome;
    let room_id = req.body.chooseRoom;
    let device_id = req.body.chooseUnregistedDevice;

    let formData = {
        home_id: home_id,
        room_id: room_id,
        mac_address: device_id
    };

    const options = {
        url: process.env.SERVER_ADD + '/api/modify/add_device?token=' + token,
        method: 'POST',
        form: formData
    };

    request(options, (err, response, body) => {
       if(err){
           res.render('add_device', {
               error: err,
               pageTitle: 'Database | Smart Lighting',
               username: req.session.username,
               key: req.session.token,
               data: null
           })
       }
       else{
           let data = JSON.parse(body);

           res.render('add_device', {
               error: null,
               pageTitle: 'Database | Smart Lighting',
               username: req.session.username,
               key: req.session.token,
               data
           })
       }
    });
};

let turnOnLight = (req, res) => {
    /*
    Dòng này lấy dữ liệu từ Array phía client về
     */
    let data = req.body;
    let home_id = req.params.home_id;
    let room_id = req.params.room_id;
    let token = req.session.token;

    console.log(data);
    //Xử lí mảng ở đây

    const options = {
        url: process.env.SERVER_ADD + '/api/data/getIlluminanceLevel/home/' + home_id + '/room/' + room_id +'?token=' + token,
        method: 'GET',
    };

    const options2 = {
        url: process.env.SERVER_ADD + '/api/data/getIlluminanceSensor/home/' + home_id + '/room/' + room_id +'?token=' + token,
        method: 'GET',
    };

    const options3 = {
        url:  process.env.SERVER_ADD + '/api/data/getBasicLighting/home/' + home_id + '/room/' + room_id +'?token=' + token,
        method: 'GET',
    };

    let requestLightLevel = new Promise((resolve, reject) => {
        request(options, (err, response, body) => {
            if(err){
                reject(err);
            }
            else{
                let illuminanceLevelArray;
                illuminanceLevelArray = JSON.parse(body);
                resolve(illuminanceLevelArray.result);
            }
        });
    });

    let requestIlluminanceSensor = new Promise((resolve, reject) => {
        request(options2, (err, response, body) => {
            if(err){
                reject(err);
            }
            else{
                let illuminanceSensorArray;
                illuminanceSensorArray = JSON.parse(body);
                resolve(illuminanceSensorArray.result);
            }
        });
    });

    let requestBasicLighting = new Promise((resolve, reject) => {
        request(options3, (err, response, body) => {
            if(err){
                reject(err);
            }
            else{
                let basicLightingArray;
                basicLightingArray = JSON.parse(body);
                resolve(basicLightingArray.result);
            }
        });
    });

    let n = 6, m = 6, c = 6;
    requestLightLevel.then(result => {
        requestIlluminanceSensor.then(_result => {
            requestBasicLighting.then(__result => {
                let natureLighting = [];
                let lightingLevel = result;
                let sensorValue = _result;
                let basicLighting = __result;

                for (let i = 0; i < lightingLevel.length; ++i) {
                    for (let j = i+1; j < lightingLevel.length; ++j) {
                        if (lightingLevel[i].location > lightingLevel[j].location) {
                            let b = lightingLevel[i];
                            lightingLevel[i] = lightingLevel[j];
                            lightingLevel[j] = b;
                        }
                    }
                }

                for (let i = 0; i < sensorValue.length; ++i) {
                    for (let j = i+1; j < sensorValue.length; ++j) {
                        if (sensorValue[i].location > sensorValue[j].location) {
                            let b = sensorValue[i];
                            sensorValue[i] = sensorValue[j];
                            sensorValue[j] = b;
                        }
                    }
                }
                console.log(sensorValue)
                console.log(lightingLevel)
                let k = 0;

                for (let i=0; i < sensorValue.length; ++i) {
                    let sum = 0;
                    for (let j = i; j < n*m; j+= n) {
                        sum = sum + basicLighting[j] * (lightingLevel[Math.floor(j/n)].value/20);
                        // console.log(j)
                        // console.log(basicLighting[j])
                        // console.log(lightingLevel[Math.floor(j/n)].value/20)
                        // console.log(sum)
                        // console.log()
                    }
                    // console.log(sensorValue[i].value);
                    // console.log(sum)
                    // console.log();
                    // console.log();
                    // console.log();
                    natureLighting.push(Math.max(sensorValue[i].value - sum,0));
                }
                // console.log(result);
                // console.log(_result);
                // console.log(__result);
                let arr = [];
                arr.push(n);arr.push(m);arr.push(c);
                for (let i in natureLighting) {
                    arr.push(natureLighting[i]);
                }
                for (let i=0; i<m ;++i) {
                    arr.push(1);
                }
                for (let i in basicLighting) {
                    arr.push(basicLighting[i]);
                }
                for (let i in data) {
                    arr.push(Number(data[i]))
                }
                for (let i in arr) {
                    console.log(arr[i])
                }
                console.log(arr)
                let check = false;
                for (let i in data) {
                    if (data[i] != -1) check = true;
                }
                if (check) {
                    console.log("result: " + arr);
                    console.log("result 2: " + addon.hello(arr));
                    let mucSangCanBat = addon.hello(arr);
                    let hamBatDen = (home_id, mac_address, switch_code , level, token) => {
                        return new Promise((resolve, reject) => {
                            let formData = {
                                "home_id": home_id,
                                "room_name": "bedroom192",
                                "device_type": 'lighting_device',
                                "device_id": mac_address,
                                "switch_code": switch_code,
                                "level": level
                            };

                            const options = {
                                url: process.env.SERVER_ADD + '/api/data/command?token=' + token,
                                method: 'POST',
                                form: formData
                            };

                            request(options, (err, response, body) => {
                                if(err){
                                    reject(err);
                                }
                                else{
                                    let data = JSON.parse(body);
                                    console.log(data);
                                    resolve("Success");
                                }
                            })
                        });
                    };
                    // let mucSangCanBat1 = [0,0,0,0,0,0];
                    for(let i = 0; i < 6; i++){
                        hamBatDen(home_id, lightingLevel[i].mac_address, 1, mucSangCanBat[i]*20, token).then(ketqua => {
                            if(ketqua === "Success"){
                                res.json({
                                    "success": true
                                })
                            }
                        }).catch(err => {
                            res.json({
                                "success": false,
                                "reason": err
                            })
                        })
                    }
                }
            }).catch(err => {
                res.json({
                    "success": false,
                    "reason": err
                })
            });
        }).catch(err => {
            res.json({
                "success": false,
                "reason": err
            })
        });
    }).catch(err => {
        res.json({
            "success": false,
            "reason": err
        })
    });
};

exports.getDeviceParam = getDeviceParam;
exports.getDeviceList = getDeviceList;
exports.addDevice = addDevice;
exports.turnOnLight = turnOnLight;
exports.handleRecord = handleRecord;
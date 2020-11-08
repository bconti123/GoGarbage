var express = require('express');
var router = express.Router();

const dotenv = require('dotenv');
dotenv.config();

router.get('/data', async function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var accesstoken;
    var request = require('request');
    var options = {
    'method': 'POST',
    'url': 'https://iam.cloud.ibm.com/identity/token',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
        'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
        'apikey': process.env.READKEY
    }
    };
    await request(options, async function (error, response) {
        if (error) throw new Error(error);
        accesstoken = await JSON.parse(response.body).access_token;
        var allData = [];
        options = {
            'method': 'GET',
            'url': process.env.READURL,
            'headers': {
                'Authorization': ('Bearer ' + accesstoken)
            }
        }
        request(options, function (error, response) {
            if (error) throw new Error(error);
            for(var i = 0; i < JSON.parse(response.body).total_rows; i++){
                allData.push(JSON.parse(response.body).rows[i].doc);
            }
            res.send(allData);
        });
        
    });
    
});

router.post('/data', function(req, res) {
    console.log("post req");
    res.header("Access-Control-Allow-Origin", "*");
    var accesstoken;
    var request = require('request');
    var options = {
    'method': 'POST',
    'url': 'https://iam.cloud.ibm.com/identity/token',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
        'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
        'apikey': process.env.WRITEKEY
    }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        accesstoken = JSON.parse(response.body).access_token;
        console.log(req.body.tags);
        console.log(req.body.position);
        options = {
            'method': 'POST',
            'url': process.env.WRITEURL,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': ('Bearer ' + accesstoken)
            },
            body: JSON.stringify({"name":req.body.name,"type":req.body.type,"tags":req.body.tags,"position":req.body.position})
        }
        request(options, function (error, response) {
            if (error) res.send(false);
            else res.send(true);           
        });
        
    });
})

module.exports = router;

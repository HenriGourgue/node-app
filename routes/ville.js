const https = require('https');
var express = require('express');
var router = express.Router();
let jsonglobal = null;

/* GET users listing. */
router.post('/', function(req, res, next) {
	getCoordinates(req.body.nom_ville).then(data => {
        	res.render('ville', { ville: req.body.nom_ville, longt: data.alt.loc.longt, latt: data.alt.loc.latt });
    	})
});

function getCoordinates(city){
    let request = new Promise((resolve, reject) => {
        const URI = "https://geocode.xyz/%20" + city + "%20Llobregat?geoit=json";
        https.get(URI, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            }
            else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error.message);
                // consume response data to free up memory
                res.resume();
                return;
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData);
                }
                catch (e) {
                    console.error(e.message);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            reject(e);
        });
    })
    return request;
}

module.exports = router;

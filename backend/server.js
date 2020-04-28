const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;
let cors = require('cors');
let bodyParser = require('body-parser');
let _ = require('lodash');
app.use(cors());
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}))

const apiKey = "8e947815f384fcb9147fa6e4657a4b45cd8345368b9249d3707da8c63c08ced0"
const apiUrl = "https://api.webflow.com/collections/5e74d1a9ef2235c09ec7d619"
let settings = {
    method: "Get",
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept-version': '1.0.0'
    }
};

app.get('/', function (req, res) {
    // Get data function
    getData().then(result => {
        res.send(result);
    });
})

// Get data of api call
let getData = () => {
    return new Promise(function (resolve, reject) {
        fetch(apiUrl + '/items', settings)
            .then(res => res.json())
            .then((json) => {
                let result = json.items;
                resolve(result);
            });
    });
}







app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
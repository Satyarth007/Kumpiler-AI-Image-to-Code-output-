const express = require('express');
const request = require('request');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/proxy', (req, res) => {
    const apiUrl = 'https://api.jdoodle.com/v1/execute';
    request.post({
        url: apiUrl,
        json: req.body,
        headers: {
            'Content-Type': 'application/json'
        }
    }, (error, response, body) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(response.statusCode).send(body);
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});

const express = require("express");
const fs = require('fs');

const port = process.env.PORT || 1337;

const app = express();

const respondText = (req, res) => {
    res.setHeader("Content-Type", 'text/plain')
    res.end("Hi, Plain Text Page")
};

const respondJson = (req, res) => {
    res.json({
        text: "hi",
        numbers: [1, 2, 3]
    });
};

const respondNotFound = (req, res) => {
    res.writeHead(404, { "Content-Type": 'text/plain' })
    res.end("404!! Page Not Found")
};

const respondEcho = (req, res) => {
    const { input = '' } = req.query;
    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input
            .split('')
            .reverse()
            .join('')
    });
};

const respondStatic = (req, res) => {
    const filename = `${__dirname}/public/${req.params[0]}`;
    fs.createReadStream(filename)
        .on('error', () => respondNotFound(req, res))
        .pipe(res)
};

// Route Initializations
app.get("/", respondText);
app.get("/json", respondJson);
app.get("/echo", respondEcho);
app.get("/static/*", respondStatic);

app.listen(port, () => console.log(`Server listening at port: ${port}`));
const path = require('path');
const express = require("express");
const app = new express();
const stream = require('youtube-audio-stream');


app.use(express.static(path.join(__dirname,'public')));

const uri = "https://www.youtube.com/watch?v=RYXFahkgNT8";

app.get("/audio", (req, res) => {
  stream(uri).pipe(res);
})

app.listen(3000, () => console.log("Ready!"))
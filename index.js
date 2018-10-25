'use strict';

const express = require('express');
const ytdl = require('ytdl-core');

const app = express();
app.use(express.static('app'));

app.get('/:id', streamAudioYT);

app.listen(80, () => {
    console.log(`Self-could-server listening on port 80.`);
});


function streamAudioYT(req, res) {
    console.log(req.ip);
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    let id = req.params.id;

    const streamYT = ytdl(id, { filter: 'audioonly' });

    const head = {
        'Content-Type': 'audio/mpeg',
    };

    res.writeHead(200, head);
    streamYT.pipe(res);
}
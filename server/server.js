const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
var fs = require('fs');
const WebSocket = require('ws');
const sslconf = require('./src/Server/SSLConfig.js');
const TokenManager = require('./src/Server/TokenManager.js');
const SocketServer = require('./src/Server/SocketServer.js');
const HttpServer = require('./src/Server/HttpServer.js');

const GameManager = require('./src/GameManager.js');

const app = express();
var wss;

const args = require('minimist')(process.argv.slice(2));
if("k" in args && "c" in args){
	sslconf.SSLConfig.useSSL = true;
	sslconf.SSLConfig.sslOptions = {
		key: fs.readFileSync(args.k),
		cert: fs.readFileSync(args.c)
	};
}

if(sslconf.SSLConfig.useSSL){
	//const forceSsl = require('express-force-ssl');
	//app.use(forceSsl);
	const port = 4430;
	const httpsServer = https.createServer(sslconf.SSLConfig.sslOptions, app);
	httpsServer.listen(port, () => {
		console.log(`HTTPS Webserver started on Port ${port}`);
	});
	//http.createServer(app).listen(80);

	wss = new WebSocket.Server({ server: httpsServer });
}else{
	const port = 80;
	app.listen(port, () => {
		console.log(`HTTP Webserver started on Port ${port}`);
	});
	const portWs = 3030;
	wss = new WebSocket.Server({ port: portWs }, () => {
		console.log(`WebSocket started on port ${portWs}`);
	});
}

//Services
const gm = new GameManager();

//Server
const tm = new TokenManager();
const ss = new SocketServer(wss, tm, gm);
const hs = new HttpServer(app, tm, gm);

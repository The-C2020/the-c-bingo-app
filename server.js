const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const app = express();

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", function (ws) {
	ws.on("message", function (data) {
		const info = JSON.parse(data);
		console.log(info.tileID);
		console.log(info.color);
		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({ tileID: info.tileID, color: info.color }));
			}
		});
	});
});

server.listen(3000, () => {
	console.log("Server is running on port 3000");
});

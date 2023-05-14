const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", function (ws) {
	console.log("Client connected");
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
	ws.on("close", () => console.log("Client disconnected"));
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

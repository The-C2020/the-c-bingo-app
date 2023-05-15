const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

app.use(express.static("client"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const board = new Array(25);

function resetBoard() {
  board.forEach((element, i) => (board[i] = undefined));
}

wss.on("connection", function (ws) {
  console.log("Client connected");
  ws.send(JSON.stringify(board)); // send board to client
  ws.on("message", function (data) {
    if (data.toString("utf8") === "reset") resetBoard(); // reset
    else {
      const info = JSON.parse(data); // analyze data
      if (board[info.tileID - 1] === undefined)
        board[info.tileID - 1] = info.color; // only unoccupied tiles can be marked
      else if (board[info.tileID - 1] === info.color) board[info.tileID - 1] = undefined; // only the color, which has already marked a tile, can unmark that tile
    }
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(board));
      }
    });
  });
  ws.on("close", () => console.log("Client disconnected"));
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

const tiles = document.querySelectorAll(".bingo-tile");
const color = document.querySelector("#color-picker");
const select = document.querySelector(".selector");
const reset = document.querySelector(".resetBoard");

let HOST = location.origin.replace(/^http/, "ws");
let server = new WebSocket(HOST);

tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const data = { tileID: tile.id, color: color.value };
    server.send(JSON.stringify(data));
  });
  tile.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    tile.classList.toggle("tile-marked");
  });
});

reset.addEventListener("click", () => {
  server.send("reset");
});

function updateBoard(board) {
  tiles.forEach((tile, index) => {
    tile.classList.remove("red");
    tile.classList.remove("blue");
    tile.classList.remove("yellow");
    tile.classList.remove("green");
    if (board[index]) tile.classList.add(`${board[index]}`);
  });
}

function changeColor() {
  select.classList.remove("red");
  select.classList.remove("blue");
  select.classList.remove("yellow");
  select.classList.remove("green");
  select.classList.toggle(select.value);
}

server.onopen = function () {
  setInterval(function () {
    server.send("ping");
  }, 50000);
};

server.onmessage = function (event) {
  const input = JSON.parse(event.data);
  updateBoard(input);
};

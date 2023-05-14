const tiles = document.querySelectorAll(".bingo-tile");
const color = document.querySelector("#color-picker");
const select = document.querySelector(".selector");

tiles.forEach((tile) => {
	tile.addEventListener("click", () => {
		const data = { tileID: tile.id, color: color.value };
		server.send(JSON.stringify(data));
	});
});

function changeColor() {
	select.classList.remove("red");
	select.classList.remove("blue");
	select.classList.remove("yellow");
	select.classList.remove("green");
	select.classList.toggle(select.value);
}

const server = new WebSocket("ws://localhost:3000/websocket");

server.onopen = function () {
	//button.disabled = false;
};

server.onmessage = function (event) {
	const data = JSON.parse(event.data);
	const clickedTile = document.getElementById(data.tileID);
	clickedTile.classList.toggle(`${data.color}`);
};

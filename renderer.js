const board = document.querySelector("#board");

const { ipcRenderer } = require("electron");

// react to 'server' events
ipcRenderer.on("read-board-content-from-store", (event, initialContent) => {
  board.innerHTML = initialContent;
});

// set 'client' events
board.addEventListener("blur", () => {
  ipcRenderer.send("board-edited", board.innerHTML);
});

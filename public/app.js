const socket = io();

var client_name = null;
var lobby_name = null;

function setup() {
  JoinRoomUI();
}

function draw() {

}

//Event listner quand on rejoins un lobby
socket.on('lobbyJoined', (players)=> LobbyUI(players));

//listner for new players
socket.on('new player joined', (players)=> newPlayerInLobby(players));

//Event listner si le nom est pris
socket.on('nameTaken', (name)=>{
  alert(name + ' is already taken, chose another name');
});

//Event listner si le lobby est en jeu
socket.on('in game', (lobbyname)=>{
  alert(lobbyname + ' is already in the middle of a game');
});

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
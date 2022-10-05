const socket = io();

function setup() {
  JoinRoomUI();
}


// UI pour rejoindre un lobby
function JoinRoomUI(){
  removeElements();
  div_joinroom = createDiv().id("div_joinroom").class("div_joinroom_class");
  inputbox_addplayer = createInput().parent('div_joinroom').class('TextBox_class');
  inputbox_addplayer.attribute('placeholder', 'Username');
  inputbox_LobbyName = createInput().parent('div_joinroom').class('TextBox_class');
  inputbox_LobbyName.attribute('placeholder', 'Lobby name');
  button_joinLobby= createButton('Join Lobby').parent('div_joinroom').class('Buttons_class').mousePressed(joinLobby);
};

//Fonction qui fait rejoindre le lobby apres un clic sur le bouton
function joinLobby(){
  if (inputbox_addplayer.value()=='' || inputbox_LobbyName.value() ==''){
    alert('fill the text boxes, before joining a lobby');
  } else {
    var client_name = inputbox_addplayer.value();
    var lobby_name = inputbox_LobbyName.value();
    socket.emit('joinLobby',client_name,lobby_name);
  };
}

//Event listner si le nom est pris
socket.on('nameTaken', (name)=>{
  alert(name + ' is already taken, chose another name');
});

//Event listner si le lobby est en jeu
socket.on('in game', (lobbyname)=>{
  alert(lobbyname + ' is already in the middle of a game');
});

socket.on('new player joined', ()=>{
  console.log('a new player joined');
});

//Event listner quand on rejoins un lobby
socket.on('lobbyJoined', (players)=> LobbyUI(players));

//ui du lobby
function LobbyUI(players){
  console.log(players);
  removeElements();
  players.forEach(player => {
    console.log(player.player_name + ' with score : ' +player.player_case);
  });
};


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
};
// UI pour rejoindre un lobby
function JoinRoomUI(){
    removeElements();

    div_joinroom = createDiv().id("panel").class("Panel_class").parent('main');
    inputbox_addplayer = createInput().class('TextBox_class').parent('panel');
    inputbox_addplayer.attribute('placeholder', 'Username');
    inputbox_LobbyName = createInput().class('TextBox_class').parent('panel');
    inputbox_LobbyName.attribute('placeholder', 'Lobby name');
    button_joinLobby= createButton('Join Lobby').class('Buttons_class').parent('panel').mousePressed(joinLobby);
};


//Fonction qui fait rejoindre le lobby apres un clic sur le bouton
function joinLobby(){
    if (inputbox_addplayer.value()=='' || inputbox_LobbyName.value() ==''){
      alert('fill the text boxes, before joining a lobby');
    } else {
      client_name = inputbox_addplayer.value();
      lobby_name = inputbox_LobbyName.value();
      socket.emit('joinLobby',client_name,lobby_name);
    };
};
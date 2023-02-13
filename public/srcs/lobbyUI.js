//ui du lobby
function LobbyUI(players){
    removeElements();

    createDiv().id("panel").class("Panel_class").parent('main');
    createImg('assets/logo.svg','QuizRushMP').mousePressed(refreshPage).parent('panel').class('Logo_class').style('opacity: 0.2');
    createDiv().id("playerCardsCarrousel").class("playerCardsCarrousel").parent('panel');
    players.forEach(player => {
      new playerCard(player);
    });
    createDiv().id("Panel_buttons").class("Lobby_buttons_div_class").parent('panel');
    createButton('start the game').class('Buttons_class').parent('Panel_buttons').mousePressed(joinLobby);
};


function newPlayerInLobby(players) {
    new playerCard(players[players.length-1]);
};

function playerCard(player) {

  this.playerCardName = player.player_name;
  this.playerCardScore = player.player_name;
  this.playerCardAvatar= player.AvatarUrl;
  
  if (player.isHost){
    createDiv().id(player.player_name).class("playerCard").parent('playerCardsCarrousel').style("background: #576b8a");
  } else {
    createDiv().id(player.player_name).class("playerCard").parent('playerCardsCarrousel');
  }
  createImg(this.playerCardAvatar,this.playerCardName).class("playerImage").parent(player.player_name);
  createP(player.player_name).class('playersCardName').parent(player.player_name);
}
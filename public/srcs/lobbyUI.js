//ui du lobby
function LobbyUI(players){
    removeElements();
    
    players.forEach(player => {
      new playerCard(player);
    });
  };


  function newPlayerInLobby(players) {
    new playerCard(players[players.length-1]);
  };

  function playerCard(player) {
    this.playerCardName = player.player_name;
    this.playerCardScore = player.player_name;
    this.playerCardAvatar= player.AvatarUrl;
    this.playerCardImage = createImg(this.playerCardAvatar,this.playerCardName);
  }
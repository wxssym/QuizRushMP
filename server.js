var express =  require('express');
var app = express();
var server = app.listen(3000);
var socket = require('socket.io');
console.log('listning on port : 3000 and running on http://localhost:3000/');
app.use(express.static('public'));
var io = socket(server);

//listner d'une nouvelle connection
io.on('connection',EventNewConnection);

function EventNewConnection(socket){
    console.log('new connection with a user established : '+ socket.id);
    EventJoinLobby(socket);
    EventDisconnect(socket);
    EventLobbyGameStarted(socket);
}

//Joining creating a lobby event
var lobbies = new Object();
function EventJoinLobby(socket){
    socket.on('joinLobby',(name,lobbyName)=>{
        if (lobbyName in lobbies) {
            if (lobbies[lobbyName].status == 'in lobby'){
                if (!isNameTaken(name,lobbyName)) {
                    lobbies[lobbyName].players.push(new player(name,lobbyName,socket.id));
                    socket.join(lobbyName);
                    console.log(`${name} joined lobby : ${lobbyName} hosted by ${lobbies[lobbyName].host}`);
                    io.to(socket.id).emit('lobbyJoined',lobbies[lobbyName].players);
                    socket.to(lobbyName).emit('playerJoined',lobbies[lobbyName].players);
                } else {
                    io.to(socket.id).emit('nameTaken',name);
                };
            } else {
                io.to(socket.id).emit('in game',lobbyName);
            }
        } else {
            lobbies[lobbyName] = new lobby(lobbyName);
            lobbies[lobbyName].players.push(new player(name,lobbyName,socket.id));
            lobbies[lobbyName].host = name;
            lobbies[lobbyName].players[0].isHost = true;
            socket.join(lobbyName);
            
    
            console.log(`${name} hosted a lobby ${lobbyName}`);
            io.to(socket.id).emit('lobbyJoined',lobbies[lobbyName].players);
        };
    });
}


//event de déconnection
function EventDisconnect(socket){
    socket.on('disconnect',()=>{
        for (let lob in lobbies) {
            for (let pla = 0; pla < lobbies[lob].players.length; pla++){
                if (lobbies[lob].players[pla].socketid == socket.id && lobbies[lob].players[pla].isHost == false ){
                    console.log(`${lobbies[lob].players[pla].player_name} disconnected from ${lob}`);
                    lobbies[lob].players.splice(pla, 1);
                    socket.to(lob).emit('playerLeave',lobbies[lob].players);
                    break;
                }else if (lobbies[lob].players[pla].socketid == socket.id && lobbies[lob].players[pla].isHost == true ) {
                    if (lobbies[lob].players.length > 1){
                        console.log(`the host ${lobbies[lob].players[pla].player_name} disconnected from ${lob}`);
                        lobbies[lob].players.splice(pla, 1);
                        lobbies[lob].players[0].isHost = true;
                        lobbies[lob].host = lobbies[lob].players[0].player_name;
                        console.log(`the new host of ${lob} is ${lobbies[lob].players[0].player_name}`);
                        socket.to(lob).emit('playerLeave',lobbies[lob].players);
                        break;
                    } else if (lobbies[lob].players.length == 1) {
                        console.log(`the host ${lobbies[lob].players[pla].player_name} disconnected from ${lob}`);
                        lobbies[lob].players.splice(pla, 1);
                        delete lobbies[lob];
                        console.log(`the lobby ${lob} was removed because no players`);
                        break;
                    };
                };
            };
        };
    });
}

function EventLobbyGameStarted(socket){
    socket.on('lobbyGameStarted',(lobbyName)=>{
        io.to(socket.id).emit('lobbyGameStart',lobbies[lobbyName].players);
        
        console.log(lobbyName + " game started");
        lobbies[lobbyName].players.forEach(player => {
            player.inGame = true;
        });
        lobbies[lobbyName].status = 'in game';


    });
}

// class de joueur
function player(name,room,id) {
    this.player_room = room;
    this.player_name = name;
    this.player_case = 0;
    this.isHost = false;
    this.inGame = false;
    this.socketid = id;
    
    this.AvatarUrl = 'https://api.dicebear.com/5.x/thumbs/svg?seed='+this.player_name;
    this.move_case = function (points) {
        this.player_case = this.player_case + points;
    };
}
// class de lobby
function lobby(lobbyName) {
    this.players = [];
    this.lobbyName = lobbyName;
    this.host = null;
    this.status = 'in lobby';

    this.change_status = function (newstatus){
        switch  (newstatus){
            case 'in lobby':
                this.status = newstatus;
                break;
            case 'in game':
                this.status = newstatus;
                break;
            default:
                console.log("this status dosn't exist");
        };
    };
}
//vérificateur de nom de joueur
function isNameTaken(name,lobbyName){
    taken = false;
    lobbies[lobbyName].players.forEach(player => {
        if (player.player_name == name ){
            taken = true;
        } 
    });
    return taken;
}

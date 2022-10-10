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
}

//Joining creating a lobby event
var lobbies = new Object();
function EventJoinLobby(socket){
    socket.on('joinLobby',(name,lobbyname)=>{
        if (lobbyname in lobbies) {
            if (lobbies[lobbyname].status == 'in lobby'){
                if (!isNameTaken(name,lobbyname)) {
                    lobbies[lobbyname].players.push(new player(name,lobbyname,socket.id));
                    socket.join(lobbyname);
                    console.log(`${name} joined lobby : ${lobbyname} hosted by ${lobbies[lobbyname].host}`);
                    io.to(socket.id).emit('lobbyJoined',lobbies[lobbyname].players);
                    socket.to(lobbyname).emit('new player joined',lobbies[lobbyname].players);
                } else {
                    io.to(socket.id).emit('nameTaken',name);
                };
            } else {
                io.to(socket.id).emit('in game',lobbyname);
            }
        } else {
            lobbies[lobbyname] = new lobby(lobbyname);
            lobbies[lobbyname].players.push(new player(name,lobbyname,socket.id));
            lobbies[lobbyname].host = name;
            lobbies[lobbyname].players[0].isHost = true;
            socket.join(lobbyname);
            

            console.log(`${name} hosted a lobby ${lobbyname}`);
            io.to(socket.id).emit('lobbyJoined',lobbies[lobbyname].players);
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
                    break;
                }else if (lobbies[lob].players[pla].socketid == socket.id && lobbies[lob].players[pla].isHost == true ) {
                    if (lobbies[lob].players.length > 1){
                        console.log(`the host ${lobbies[lob].players[pla].player_name} disconnected from ${lob}`);
                        lobbies[lob].players.splice(pla, 1);
                        lobbies[lob].players[0].isHost = true;
                        lobbies[lob].host = lobbies[lob].players[0].player_name;
                        console.log(`the new host of ${lob} is ${lobbies[lob].players[0].player_name}`);
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

// class de joueur
function player(name,room,id) {
    this.player_room = room;
    this.player_name = name;
    this.player_case = 0;
    this.isHost = false;
    this.socketid = id;
    this.AvatarUrl = 'https://avatars.dicebear.com/api/croodles-neutral/'+this.player_name+'.svg?size=50&background=%23f0c400';
    this.move_case = function (points) {
        this.player_case = this.player_case + points;
    };
}
// class de lobby
function lobby(lobbyname) {
    this.players = [];
    this.lobbyname = lobbyname;
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
function isNameTaken(name,lobbyname){
    taken = false;
    lobbies[lobbyname].players.forEach(player => {
        if (player.player_name == name ){
            taken = true;
        } 
    });
    return taken;
}

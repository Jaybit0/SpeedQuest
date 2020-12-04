
socket = (window.location.protocol == "http:") ?
 new WebSocket("ws://" + window.location.hostname + ":4430?token=" + getUrlParam(window.location.href).token) :
 new WebSocket("wss://" + window.location.host + "?token=" + getUrlParam(window.location.href).token);

var contacts = [];
var user = null;
var gamekey = "";

var playerList = new ListManager('#playerlist', '#playerListItemTemplate', (function (viewItem, contact){
	$(viewItem).find('a[class="username"]').text(contact.name);
  $(viewItem).find('a[class="username"]').attr('style', 'color:' + contact.color + ';');
  $(viewItem).find('img[class="online-status"]').attr('src',
      contact.state == 0 ?
        './images/offline.png' :
        './images/online_3.png');
  $(viewItem).find('img[class="currplayer-status"]').attr('src', contact.isCurrPlayer ? './images/currPlayer.png' : '');
  $(viewItem).find('img[class="trottelmuetze-status"]').attr('src', contact.isTrottelmuetze ? './images/trottelmuetze_icon.png' : '');
	$(viewItem).find('a[class="score"]').text(contact.score);

}), function (contact) {return contact.name});


socket.onopen = function (e) {
//	console.log("Verbindung hergestellt");
}

socket.onmessage = function (msg) {
	data = JSON.parse(msg.data);

  console.log(data);

	if (data.packet == "initial") {
		user = data.userself;
		showInviteLink(data.gamekey);
		editPlayerList(data.playerlist);
    toggleMoveState("WAITING", 0);
	}
	else if (data.packet == "playerupdate") {
		editPlayerList(data.updateplayers);
	}
	else if (data.packet == "gamestate") {
    toggleMoveState(data.gamestate, data.round);
		editPlayerList(data.updateplayers);
	}
	else if (data.packet == "taskassign") {
    $('#gamename').text(data.task.name  + "    " + msg.data);
	}
}

function toggleMoveState(state, round){
  $('#stateview').text(state);
  if(state == "WAITING"){
    if(user.isHost)
      $('#startgame').show();
    else
      $('#startgame').hide();

    $('#playBtn').hide();
    $('#roundview').hide();
    $('#gamename').hide();
  }else if(state == "INGAME"){
    $('#gamename').show();
    $('#playBtn').show();
    $('#roundview').text("Round " + round.toString());
    if(user.isHost)
      $('#startgame').hide();
  }else if(state == "FINISHED"){
    $('#roundview').hide();
    $('#gamename').hide();
    $('#playBtn').hide();
    if(user.isHost)
      $('#startgame').show();
  }
}

function getGameLink(){
  return `/gamelink?key=${gamekey}`;
}

function showInviteLink(key){
  gamekey = key;
  if (window.history.replaceState) {
     window.history.replaceState(null, "Trottelmuetze", getGameLink());
  }
}

function startGame(){
  var message = {
    packet: "startgame",
    settings: {
      roundcount: 5
    }
  };
  socket.send(JSON.stringify(message));
}

function play(score){
  var message = {
    packet: "taskinfo",
    taskdone: true,
    rating: score
  };
  socket.send(JSON.stringify(message));
}

function endgame(){
  var message = {
    playerlist: {
      endgame: {}
    }
  };
  socket.send(JSON.stringify(message));
}

socket.onclose = function (e) {
	alert("Verbindung wurde unterbrochen! Bitte laden sie die Webseite neu.");
	location.href = getGameLink();
}

socket.onerror = function (e) {
	console.error("Fehler bei der Datenübertragung.")
}

function editPlayerList(data) {
	if(user == null)
		return;
  playerList.update(data);
}

function logout() {
	socket.onclose = new function () {};
	socket.close();
	location.href = "/login";
}

function getUrlParam(url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
}

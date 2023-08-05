'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
  '#2196F3', '#32c787', '#00BCD4', '#ff5652',
  '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

var playerPositions = {}; // Added point

function connect(event) {
  username = document.querySelector('#name').value.trim();

  if (username) {
    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    var socket = new SockJS('/websocket');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
  }
  event.preventDefault();
}

function onConnected() {
  // Subscribe to the Public Topic
  stompClient.subscribe('/topic/public', onMessageReceived);

  // Tell your username to the server
  stompClient.send("/app/chat.register",
    {},
    JSON.stringify({ sender: username, type: 'JOIN' })
  )

  connectingElement.classList.add('hidden');
}

function onError(error) {
  connectingElement.textContent = 'A WebSocket error occurred.';
  connectingElement.style.color = 'red';
}

function send(event) {
  var messageContent = messageInput.value.trim();

  if (messageContent && stompClient) {
    var chatMessage = {
      sender: username,
      content: messageInput.value,
      key: messageInput.value,
      type: 'CHAT'
    };

    stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
    messageInput.value = '';
  }
  event.preventDefault();
}

function onMessageReceived(payload) {
  var message = JSON.parse(payload.body);

  if (message.type === 'JOIN') {
    var joinMessageElement = createEventMessageElement(message.sender + ' joined!');
    messageArea.appendChild(joinMessageElement);
  } else if (message.type === 'LEAVE') {
    var leaveMessageElement = createEventMessageElement(message.sender + ' left!');
    messageArea.appendChild(leaveMessageElement);
  } else {
    var chatMessageElement = createChatMessageElement(message.sender, message.content);
    messageArea.appendChild(chatMessageElement);
  }

  messageArea.scrollTop = messageArea.scrollHeight;

  if (message.playerBoards) {
    var playerBoards = message.playerBoards;
    for (var i = 0; i < playerBoards.length; i++) {
      var playerBoard = playerBoards[i];
      updatePlayerBoard(playerBoard.sender, playerBoard.playerBoard); // Added point
    }
  }
}

function createEventMessageElement(content) {
  var messageElement = document.createElement('li');
  messageElement.classList.add('event-message');

  var contentElement = document.createElement('span');
  var contentText = document.createTextNode(content);
  contentElement.appendChild(contentText);

  messageElement.appendChild(contentElement);
  return messageElement;
}

function createChatMessageElement(sender, content) {
  var messageElement = document.createElement('li');
  messageElement.classList.add('chat-message');

  var avatarElement = document.createElement('i');
  var avatarText = document.createTextNode(sender[0]);
  avatarElement.appendChild(avatarText);
  avatarElement.style['background-color'] = getAvatarColor(sender);

  var usernameElement = document.createElement('span');
  var usernameText = document.createTextNode(sender);
  usernameElement.appendChild(usernameText);

  var contentElement = document.createElement('p');
  var contentText = document.createTextNode(content);
  contentElement.appendChild(contentText);

  messageElement.appendChild(avatarElement);
  messageElement.appendChild(usernameElement);
  messageElement.appendChild(contentElement);

  return messageElement;
}

function getAvatarColor(messageSender) {
  var hash = 0;
  for (var i = 0; i < messageSender.length; i++) {
    hash = 31 * hash + messageSender.charCodeAt(i);
  }

  var index = Math.abs(hash % colors.length);
  return colors[index];
}

function updatePlayerBoard(sender, playerBoard) {
  var playerBoardElement = document.getElementById(
    'player-board-' + sender
  );
  playerBoardElement.innerHTML = ''; // Clear previous content

  for (var i = 0; i < playerBoard.length; i++) {
    var row = playerBoard[i];

    var rowElement = document.createElement('div');
    rowElement.className = 'row';

    for (var j = 0; j < row.length; j++) {
      var cell = row[j];

      var cellElement = document.createElement('div');
      cellElement.className = 'cell';
      cellElement.style.backgroundColor = getBlockColor(cell);

      rowElement.appendChild(cellElement);
    }

    playerBoardElement.appendChild(rowElement);
  }

  // Set the position of the player board
  var playerPosition = playerPositions[sender];
  if (playerPosition) {
    playerBoardElement.style.left = playerPosition.left;
    playerBoardElement.style.top = playerPosition.top;
  }
}

function getBlockColor(value) {
  switch (value) {
    case 0:
      return '#FFFFFF'; // White
    case 1:
      return '#000000'; // Black
    case 10:
      return '#FFC0CB'; // Pink
    case 20:
      return '#00FF00'; // Green
    case 30:
      return '#0000FF'; // Blue
    case 40:
      return '#FFFF00'; // Yellow
    case 50:
      return '#FF0000'; // Red
    case 60:
      return '#800080'; // Purple
    case 70:
      return '#4B0082'; // Indigo
    default:
      return '#000000'; // Default to black for unknown values
  }
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', send, true)

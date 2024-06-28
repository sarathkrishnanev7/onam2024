// script.js
const player = document.getElementById('player');
const item = document.getElementById('item');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const shareButton = document.getElementById('share');
let score = 0;
let obstacles = [];
let playerSize = 20; // Size of player
let itemSize = 20;   // Size of item
let moveCount = 0;   // Track moves for shortest path calculation
let shortestPath = 20; // Assuming shortest path is a straight line (can be adjusted based on actual game logic)

document.getElementById('up').addEventListener('click', () => movePlayer('ArrowUp'));
document.getElementById('down').addEventListener('click', () => movePlayer('ArrowDown'));
document.getElementById('left').addEventListener('click', () => movePlayer('ArrowLeft'));
document.getElementById('right').addEventListener('click', () => movePlayer('ArrowRight'));

shareButton.addEventListener('click', shareOnWhatsApp);

function movePlayer(direction) {
  const playerRect = player.getBoundingClientRect();
  const gameRect = gameContainer.getBoundingClientRect();

  switch (direction) {
    case 'ArrowUp':
      if (playerRect.top > gameRect.top) player.style.top = `${player.offsetTop - 20}px`;
      break;
    case 'ArrowDown':
      if (playerRect.bottom < gameRect.bottom) player.style.top = `${player.offsetTop + 20}px`;
      break;
    case 'ArrowLeft':
      if (playerRect.left > gameRect.left) player.style.left = `${player.offsetLeft - 20}px`;
      break;
    case 'ArrowRight':
      if (playerRect.right < gameRect.right) player.style.left = `${player.offsetLeft + 20}px`;
      break;
  }

  // Decrease score by 1 for every step
  score -= 1;
  moveCount += 1;
  scoreDisplay.textContent = `Score: ${score}`;

  moveObstacles();
  checkCollision();
}

function moveObstacles() {
  obstacles.forEach(obstacle => {
    const direction = Math.floor(Math.random() * 4);
    const obstacleRect = obstacle.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();

    switch (direction) {
      case 0: // Move up
        if (obstacleRect.top > gameRect.top) obstacle.style.top = `${obstacle.offsetTop - 20}px`;
        break;
      case 1: // Move down
        if (obstacleRect.bottom < gameRect.bottom) obstacle.style.top = `${obstacle.offsetTop + 20}px`;
        break;
      case 2: // Move left
        if (obstacleRect.left > gameRect.left) obstacle.style.left = `${obstacle.offsetLeft - 20}px`;
        break;
      case 3: // Move right
        if (obstacleRect.right < gameRect.right) obstacle.style.left = `${obstacle.offsetLeft + 20}px`;
        break;
    }
  });
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  if (
    playerRect.left < itemRect.right &&
    playerRect.right > itemRect.left &&
    playerRect.top < itemRect.bottom &&
    playerRect.bottom > itemRect.top
  ) {
    score += 20;
    if (moveCount <= shortestPath) {
      score += 5; // Bonus for shortest path
    }
    moveCount = 0; // Reset move count for next item
    scoreDisplay.textContent = `Score: ${score}`;
    moveItem();
    addObstacle();

    // Increase size by 10%
    playerSize *= 1.1;
    itemSize *= 1.1;
    player.style.width = `${playerSize}px`;
    player.style.height = `${playerSize}px`;
    item.style.width = `${itemSize}px`;
    item.style.height = `${itemSize}px`;
  }

  obstacles.forEach(obstacle => {
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      alert('Game Over!');
      shareButton.style.display = 'block'; // Show the share button
      resetGame();
    }
  });
}

function moveItem() {
  const gameRect = gameContainer.getBoundingClientRect();
  const maxTop = gameRect.height - item.clientHeight;
  const maxLeft = gameRect.width - item.clientWidth;

  item.style.top = `${Math.random() * maxTop}px`;
  item.style.left = `${Math.random() * maxLeft}px`;
}

function addObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  gameContainer.appendChild(obstacle);
  obstacles.push(obstacle);
}

function resetGame() {
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  player.style.top = '360px';
  player.style.left = '180px';
  playerSize = 20; // Reset size
  itemSize = 20;   // Reset size
  player.style.width = `${playerSize}px`;
  player.style.height = `${playerSize}px`;
  item.style.width = `${itemSize}px`;
  item.style.height = `${itemSize}px`;
  moveItem();
  obstacles.forEach(obstacle => obstacle.remove());
  obstacles = [];
}

function shareOnWhatsApp() {
  const screenshotCanvas = document.createElement('canvas');
  screenshotCanvas.width = gameContainer.offsetWidth;
  screenshotCanvas.height = gameContainer.offsetHeight;
  const context = screenshotCanvas.getContext('2d');

  html2canvas(gameContainer).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const shareText = `I scored ${score} points in Mahabali's Stepping Stones!`;
    const shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}%0A${encodeURIComponent(imgData)}`;

    window.open(shareLink, '_blank');
  });
}

// Initialize the game
moveItem();

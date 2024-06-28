// script.js
const player = document.getElementById('player');
const item = document.getElementById('item');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
let score = 0;
let obstacles = [];
let playerSize = 50; // Initial size of player
let itemSize = 30;   // Initial size of item

document.addEventListener('keydown', movePlayer);

function movePlayer(event) {
  const key = event.key;
  const playerRect = player.getBoundingClientRect();
  const gameRect = gameContainer.getBoundingClientRect();

  switch (key) {
    case 'ArrowUp':
      if (playerRect.top > gameRect.top) player.style.top = `${player.offsetTop - 10}px`;
      break;
    case 'ArrowDown':
      if (playerRect.bottom < gameRect.bottom) player.style.top = `${player.offsetTop + 10}px`;
      break;
    case 'ArrowLeft':
      if (playerRect.left > gameRect.left) player.style.left = `${player.offsetLeft - 10}px`;
      break;
    case 'ArrowRight':
      if (playerRect.right < gameRect.right) player.style.left = `${player.offsetLeft + 10}px`;
      break;
  }

  // Decrease score by 1 for every step
  score -= 1;
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
        if (obstacleRect.top > gameRect.top) obstacle.style.top = `${obstacle.offsetTop - 10}px`;
        break;
      case 1: // Move down
        if (obstacleRect.bottom < gameRect.bottom) obstacle.style.top = `${obstacle.offsetTop + 10}px`;
        break;
      case 2: // Move left
        if (obstacleRect.left > gameRect.left) obstacle.style.left = `${obstacle.offsetLeft - 10}px`;
        break;
      case 3: // Move right
        if (obstacleRect.right < gameRect.right) obstacle.style.left = `${obstacle.offsetLeft + 10}px`;
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
    score += 10;
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
  player.style.top = '90%';
  player.style.left = '45%';
  playerSize = 50; // Reset size
  itemSize = 30;   // Reset size
  player.style.width = `${playerSize}px`;
  player.style.height = `${playerSize}px`;
  item.style.width = `${itemSize}px`;
  item.style.height = `${itemSize}px`;
  moveItem();
  obstacles.forEach(obstacle => obstacle.remove());
  obstacles = [];
}

// Initialize the game
moveItem();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let lives = 3;
let isGameOver = false;
const gameObjects = [];
const initialSpawnRate = 1000; // milliseconds
let spawnRate = initialSpawnRate; // current spawn rate
let gameInterval; // To store the interval ID

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

// Load images
const fruitImages = [
    'images/apple1-removebg-preview.png',
    'images/banana1.png',
    'images/orange1-removebg-preview.png',
    'images/cherries1.png',
    'images/watermelon1.png',
    // Add more fruit images as needed
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

const bombImage = new Image();
bombImage.src = 'images/bomb1-removebg-preview.png';

class GameObject {
    constructor(x, y, radius, type) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.type = type;
        this.velocityX = Math.random() * 4 - 2;
        this.velocityY = Math.random() * 4 - 10;
        this.gravity = 0.1;
        if (type === 'fruit') {
            this.image = fruitImages[Math.floor(Math.random() * fruitImages.length)];
        } else {
            this.image = bombImage;
        }
    }

    update() {
        this.velocityY += this.gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    draw() {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2.5, this.radius * 2.5);
    }
}

function spawnGameObject() {
    if (isGameOver) return;
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const radius = 60; // Increased size
    const type = Math.random() > 0.9 ? 'bomb' : 'fruit';
    gameObjects.push(new GameObject(x, y, radius, type));
}

canvas.addEventListener('mousemove', function(event) {
    if (isGameOver) return;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    for (let i = 0; i < gameObjects.length; i++) {
        const obj = gameObjects[i];
        const distance = Math.sqrt((mouseX - obj.x) ** 2 + (mouseY - obj.y) ** 2);
        if (distance < obj.radius) {
            if (obj.type === 'fruit') {
                score++;
            } else if (obj.type === 'bomb') {
                gameOver();
            }
            gameObjects.splice(i, 1);
            break;
        }
    }
});

function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < gameObjects.length; i++) {
        const obj = gameObjects[i];
        obj.update();
        obj.draw();

        if (obj.y > canvas.height) {
            if (obj.type === 'fruit') {
                lives--;
                if (lives === 0) {
                    gameOver();
                }
            }
            gameObjects.splice(i, 1);
            i--;
        }
    }

    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('lives').textContent = `Lives: ${lives}`;

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    isGameOver = true;
    document.getElementById('finalScore').textContent = `Final Score: ${score}`;
    gameOverScreen.style.display = 'block';
    clearInterval(gameInterval); // Clear the interval when game over
}

function startGame() {
    isGameOver = false;
    score = 0;
    lives = 3;
    gameObjects.length = 0;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    clearInterval(gameInterval); // Clear any existing interval
    gameInterval = setInterval(spawnGameObject, spawnRate); // Set new interval
    requestAnimationFrame(gameLoop);
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Show the start screen initially
startScreen.style.display = 'block';
canvas.style.display = 'none';

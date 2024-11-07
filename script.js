let score = 0;
let isGameOver = false;
let isAccelerating = false;
let goat = document.getElementById('goat');
let obstacleSpeed = 2; // Vitesse initiale
let minObstacleSpeed = 1.5; // Vitesse minimale
let speedIncrement = 0.1; // Incrément de la vitesse
let gameInterval;
let obstacles = []; // Tableau pour stocker les obstacles

document.addEventListener('keydown', function(event) {
    if (!isGameOver) {
        if (event.code === 'Space') {
            jump();
        } else if (event.code === 'ArrowRight') {
            isAccelerating = true;
            accelerate();
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'ArrowRight') {
        isAccelerating = false;
        resetPosition();
    }
});

function jump() {
    if (!goat.classList.contains('jump')) {
        goat.classList.add('jump');
        setTimeout(() => {
            goat.classList.remove('jump');
        }, 500);
    }
}

function accelerate() {
    goat.style.transform = 'translateX(50px)';
}

function resetPosition() {
    goat.style.transform = 'translateX(0)';
}

function createObstacle() {
    let obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.animation = `moveObstacle ${obstacleSpeed}s linear infinite`;
    document.getElementById('gameContainer').appendChild(obstacle);
    obstacles.push(obstacle);
}

function removeObstacle(obstacle) {
    obstacle.remove();
    obstacles = obstacles.filter(obs => obs !== obstacle);
}

function checkCollision() {
    obstacles.forEach((obstacle) => {
        let goatTop = parseInt(window.getComputedStyle(goat).getPropertyValue('bottom'));
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));

        if (obstacleLeft < 100 && obstacleLeft > 50 && goatTop <= 50) {
            if (isAccelerating) {
                console.log(`Obstacle détruit !`);
                obstacle.classList.add('destroyed');

                setTimeout(() => {
                    removeObstacle(obstacle);
                    createObstacle();
                    score++; // Incrémente le score lors de la destruction
                    document.getElementById('score').innerText = 'Score: ' + score;
                }, 500);
            } else {
                console.log('Game Over !');
                alert('Game Over! Score: ' + score);
                isGameOver = true;
                clearInterval(gameInterval);
                obstacles.forEach(obs => obs.style.animation = 'none');
                document.getElementById('restartButton').style.display = 'block';
            }
        }

        // Vérifie si l'obstacle est passé avec succès
        if (obstacleLeft < 0 && !obstacle.classList.contains('destroyed')) {
            removeObstacle(obstacle);
            createObstacle();
            score++; // Incrémente le score lors du passage réussi
            document.getElementById('score').innerText = 'Score: ' + score;
        }
    });
}

function startGameInterval() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (isGameOver) return;

        checkCollision();

        if (obstacleSpeed > minObstacleSpeed) {
            obstacleSpeed -= speedIncrement; // Augmentation progressive de la difficulté
        }
    }, 100);
}

// Crée les obstacles initiaux synchronisés
function initializeObstacles() {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            createObstacle();
        }, i * 2000); // Décale la création pour les synchroniser
    }
}

initializeObstacles();
startGameInterval();

function restartGame() {
    console.log('Redémarrage du jeu...');
    score = 0;
    isGameOver = false;
    document.getElementById('score').innerText = 'Score: 0';
    obstacleSpeed = 2;

    // Supprime les obstacles existants et en recrée de nouveaux
    document.querySelectorAll('.obstacle').forEach(obs => obs.remove());
    obstacles = [];
    initializeObstacles();

    document.getElementById('restartButton').style.display = 'none';
    startGameInterval();
}
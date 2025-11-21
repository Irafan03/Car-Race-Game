const player = document.querySelector(".PlayerCar");
const gameArea = document.querySelector(".GameArea");
const startScreen = document.querySelector(".StartScreen");
const scoreDisplay = document.querySelector(".Score");
const highScoreDisplay = document.querySelector(".highScore");
const timerDisplay = document.querySelector(".timer");

let gameActive = false;
let playerPosition = { x: 175, y: 500 };
let obstacles = [];
let score = 0;
let highScore = 0;
let startTime;
let timerInterval;

highScoreDisplay.innerText = "High Score: " + highScore;

// ----------------------------
//     LANCER LE JEU
// ----------------------------
function startGame() {
    gameActive = true;
    startScreen.style.display = "none";
    player.style.left = playerPosition.x + "px";
    player.style.top = playerPosition.y + "px";
    
    score = 0;
    scoreDisplay.innerText = "Score: " + score;

    startTimer();
    window.requestAnimationFrame(gameLoop);
}

// ----------------------------
//            TIMER
// ----------------------------
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.innerText = "Time: " + elapsed + "s";
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// ----------------------------
//   DEPLACEMENTS PLAYER
// ----------------------------
document.addEventListener("keydown", function(e){
    if(!gameActive) return;

    if(e.key === "ArrowLeft" && playerPosition.x > 0){
        playerPosition.x -= 30;
    }
    if(e.key === "ArrowRight" && playerPosition.x < 350){
        playerPosition.x += 30;
    }

    player.style.left = playerPosition.x + "px";
});

// ----------------------------
//       CREATION OBSTACLE
// ----------------------------
function createObstacle() {
    const obs = document.createElement("div");
    obs.classList.add("Obstacle");
    obs.style.left = Math.floor(Math.random() * 8) * 50 + "px";
    obs.style.top = "-120px";

    gameArea.appendChild(obs);
    obstacles.push(obs);
}

// ----------------------------
//        EXPLOSION
// ----------------------------
function showExplosion(player, obstacle) {
    const boom = document.createElement("div");
    boom.classList.add("Explosion");

    const pRect = player.getBoundingClientRect();
    const oRect = obstacle.getBoundingClientRect();

    const x = (pRect.left + oRect.left) / 2;
    const y = (pRect.top + oRect.top) / 2;

    boom.style.left = x + "px";
    boom.style.top = y + "px";

    document.body.appendChild(boom);

    setTimeout(() => boom.remove(), 1000);
}

// ----------------------------
//          GAME LOOP
// ----------------------------
function gameLoop() {
    if(!gameActive) return;

    if(Math.random() < 0.02){
        createObstacle();
    }

    for(let i = obstacles.length - 1; i >= 0; i--){
        let obs = obstacles[i];
        let top = parseInt(obs.style.top);
        top += 5;
        obs.style.top = top + "px";

        if(isCollide(player, obs)){
            showExplosion(player, obs);
            endGame();
            return;
        }

        if(top > 600){
            obs.remove();
            obstacles.splice(i, 1);
            score += 1;
            scoreDisplay.innerText = "Score: " + score;
        }
    }

    window.requestAnimationFrame(gameLoop);
}

// ----------------------------
//         COLLISION
// ----------------------------
function isCollide(a, b){
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
        aRect.top > bRect.bottom ||
        aRect.bottom < bRect.top ||
        aRect.left > bRect.right ||
        aRect.right < bRect.left
    );
}

// ----------------------------
//        FIN DU JEU
// ----------------------------
function endGame() {
    gameActive = false;
    startScreen.style.display = "flex";
    startScreen.innerHTML = `<p>GAME OVER!<br>  PLAY AGAIN</p>`;

    obstacles.forEach(obs => obs.remove());
    obstacles = [];

    stopTimer();

    if(score > highScore){
        highScore = score;
    }
    highScoreDisplay.innerText = "High Score: " + highScore;

    score = 0;
    scoreDisplay.innerText = "Score: " + score;
}

// ----------------------------
//   CLICK POUR DEMARRER
// ----------------------------
startScreen.addEventListener("click", startGame);

const startButton = document.getElementById('startButton');
const homeButton = document.getElementById('homeButton');
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('gamePage').style.display = 'block';
    startGame();
});


document.getElementById('homeButton').addEventListener('click', () => {
    document.getElementById('gamePage').style.display = 'none';
    document.getElementById('homePage').style.display = 'flex';
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
resizeCanvas();
window.addEventListener('resize',resizeCanvas);

function resizeCanvas(){
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 150;
}

const launchSound = document.getElementById('launchSound');
const hitSound = document.getElementById('hitSound');

let projectiles = [];
let obstacles = [];
let target = {
    x: canvas.width - 150,
    y: canvas.height - 100,
    width: 30,
    height: 30
};

let score = 0;
let hits = 0;
let level = 1;
let gravity = 0.5;
let friction = 0.99;

class Projectile {
    constructor(angle,velocity) {
        this.x = 50;
        this.y = canvas.height - 30;
        this.radius = 10;
        this.vx = velocity * Math.cos(angle);
        this.vy = -velocity * Math.sin(angle);
        this.launched = true;
        this.distance = 0;
    }

    update() {
        if (this.launched) {
            this.vy += gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= friction;
            this.distance += Math.sqrt(this.vx * this.vx + this.vy * this.vy);

            if (this.y + this.radius >= canvas.height) {
                this.y = canvas.height - this.radius;
                this.vy = 0;
                this.launched = false;
            }

            for (let obstacle of obstacles) {
                if (
                    this.x + this.radius > obstacle.x &&
                    this.x - this.radius < obstacle.x + obstacle.width &&
                    this.y + this.radius > obstacle.y &&
                    this.y - this.radius < obstacle.y + obstacle.height
                ) {
                    this.launched = false;
                    alert("You hit an obstacle!");
                }
            }

            if (
                this.x + this.radius > target.x &&
                this.x - this.radius < target.x + target.width &&
                this.y + this.radius > target.y &&
                this.y - this.radius < target.y + target.height
            ) {
                hits++;
                score += 100;
                document.getElementById('hits').innerText = `Hits: ${hits}`;
                document.getElementById('score').innerText = `Score: ${score}`;
                this.launched = false;
                hitSound.play();
                setTimeout(nextLevel, 1000);
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'lightblue';
        ctx.fill();
        ctx.closePath();
    }
}

class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = '#e53935';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function drawTarget() {
    ctx.fillStyle = 'green';
    ctx.fillRect(target.x, target.y, target.width, target.height);
    ctx.fillText('Target', target.x - 10, target.y - 10);
}

function generateObstacles() {
    obstacles = [];
    for (let i = 0; i < level; i++) {
        let validPosition = false;
        let x, y;
        while (!validPosition) {
        x = Math.random() * (canvas.width - 100) + 50;
        y = Math.random() * (canvas.height - 150) + 50;
        validPosition = true;

        for(let obstacle of obstacles) {
            if(Math.abs(x - obstacle.x) < 100 && Math.abs(y - obstacle.y) < 100){
                validPosition = false;
                break;
            }
        }
        }
        obstacles.push(new Obstacle(x, y, 50, 10));
    }
}

function launchProjectile() {
    const angle = document.getElementById('angle').value * Math.PI / 180;
    const velocity = (document.getElementById('velocity').value);
    // Clear previous projectiles
    projectiles = [];
    // Launch a new projectile with a consistent initial velocity
    const newProjectile = new Projectile(angle, velocity);
    projectiles.push(newProjectile);
    launchSound.play();
}

function nextLevel() {
    level++;
    document.getElementById('level').innerText = `Level: ${level}`;
    target.x = Math.random() * (canvas.width - 60) + 30;
    target.y = Math.random() * (canvas.height - 60) + 30;
    projectiles = []; // Clear existing projectiles before starting a new level
    generateObstacles();

}
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawTarget();
    for (let obstacle of obstacles) {
        obstacle.draw();
    }
    for (let i = 0; i < projectiles.length; i++) {
        const projectile = projectiles[i];
        projectile.update();
        projectile.draw();
        document.getElementById('displacement').innerText = `Displacement: ${Math.round(projectile.distance)}m`;
    }

    requestAnimationFrame(update);
}

document.getElementById('launchButton').addEventListener('click', launchProjectile);
document.getElementById('launchButton').addEventListener('touchstart', launchProjectile);

function startGame() {
    generateObstacles();
    update();
}

function resetGame(){
    level = 1;
    score = 0;
    hits = 0;
    displacement = 0;
    document.getElementById('level').innerText = `Level: ${level}`;
    document.getElementById('hits').innerText = `Hits: ${hits}`;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('displacement').innerText = `Displacement: ${Math.round(projectile.distance)}m`;
    target = createRandomTarget();
    generateObstacles();
}

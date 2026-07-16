import './style.css';

const state = {
  player: {
    x: 400,
    y: 300,
    radius: 18,
    angle: -Math.PI / 2,
    speed: 0,
    rotationSpeed: 0.08,
    thrust: 0.12,
    alive: true,
  },
  asteroids: [],
  bullets: [],
  keys: {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
  },
  game: {
    width: 800,
    height: 600,
    score: 0,
    lives: 3,
    over: false,
  },
  effects: {
    particles: [],
  },
};

const app = document.getElementById('app');
const canvas = document.createElement('canvas');
canvas.width = state.game.width;
canvas.height = state.game.height;
canvas.className = 'game-canvas';
app.appendChild(canvas);

const ctx = canvas.getContext('2d');
let lastTime = 0;

function wrapAround(entity) {
  if (entity.x < -20) entity.x = canvas.width + 20;
  if (entity.x > canvas.width + 20) entity.x = -20;
  if (entity.y < -20) entity.y = canvas.height + 20;
  if (entity.y > canvas.height + 20) entity.y = -20;
}

function updatePlayer(dt) {
  const player = state.player;

  if (state.keys.KeyA || state.keys.ArrowLeft) {
    player.angle -= player.rotationSpeed * dt * 60;
  }
  if (state.keys.KeyD || state.keys.ArrowRight) {
    player.angle += player.rotationSpeed * dt * 60;
  }

  if (state.keys.KeyW || state.keys.ArrowUp) {
    player.speed += player.thrust * dt * 60;
  } else if (state.keys.KeyS || state.keys.ArrowDown) {
    player.speed -= player.thrust * dt * 60;
  } else {
    player.speed *= 0.97;
  }

  player.speed = Math.max(-2.2, Math.min(player.speed, 4.5));
  player.x += Math.cos(player.angle) * player.speed;
  player.y += Math.sin(player.angle) * player.speed;

  wrapAround(player);
}

function drawPlayer() {
  const player = state.player;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(-12, 10);
  ctx.lineTo(-6, 0);
  ctx.lineTo(-12, -10);
  ctx.closePath();
  ctx.strokeStyle = '#f9fafb';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (state.keys.KeyW || state.keys.ArrowUp) {
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-18, 0);
    ctx.lineTo(-12, 5);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-12, -5);
    ctx.closePath();
    ctx.fillStyle = '#ff8c42';
    ctx.fill();
  }

  ctx.restore();
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#04070f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 60; i += 1) {
    const x = (i * 97) % canvas.width;
    const y = (i * 53) % canvas.height;
    ctx.fillStyle = i % 3 === 0 ? '#4b5563' : '#6b7280';
    ctx.fillRect(x, y, 2, 2);
  }

  drawPlayer();
}

function update(dt) {
  updatePlayer(dt);
}

function gameLoop(timestamp) {
  const delta = Math.min((timestamp - lastTime) / 1000 || 0.016, 0.03);
  lastTime = timestamp;

  update(delta);
  drawScene();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
    event.preventDefault();
  }

  if (event.code in state.keys) {
    state.keys[event.code] = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.code in state.keys) {
    state.keys[event.code] = false;
  }
});

requestAnimationFrame(gameLoop);

export default state;

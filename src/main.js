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

function createAsteroid(x, y, radius = 40) {
  const points = [];
  const jagged = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < jagged; i += 1) {
    const angle = (Math.PI * 2 * i) / jagged;
    const offset = radius * (0.75 + Math.random() * 0.5);
    points.push({
      x: Math.cos(angle) * offset,
      y: Math.sin(angle) * offset,
    });
  }

  return {
    x,
    y,
    radius,
    angle: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 1.5,
    rotation: (Math.random() - 0.5) * 0.015,
    points,
  };
}

function spawnAsteroids(count = 6) {
  state.asteroids = [];
  for (let i = 0; i < count; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    if (Math.hypot(x - state.player.x, y - state.player.y) < 120) {
      i -= 1;
      continue;
    }
    state.asteroids.push(createAsteroid(x, y, 40 + Math.random() * 30));
  }
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

function drawAsteroid(asteroid) {
  ctx.save();
  ctx.translate(asteroid.x, asteroid.y);
  ctx.rotate(asteroid.angle);

  ctx.beginPath();
  asteroid.points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();

  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  ctx.stroke();

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

  state.asteroids.forEach(drawAsteroid);
  drawPlayer();
}

function updateAsteroids(dt) {
  state.asteroids.forEach((asteroid) => {
    asteroid.x += Math.cos(asteroid.angle) * asteroid.speed * dt * 60;
    asteroid.y += Math.sin(asteroid.angle) * asteroid.speed * dt * 60;
    asteroid.angle += asteroid.rotation * dt * 60;
    wrapAround(asteroid);
  });
}

function update(dt) {
  updatePlayer(dt);
  updateAsteroids(dt);
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

spawnAsteroids(7);
requestAnimationFrame(gameLoop);

export default state;

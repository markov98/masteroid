import './style.css';
import { state } from './state.js';
import { setupInput } from './input.js';
import { createCanvas, clearScene, drawBackground } from './renderer.js';
import { drawBullets, drawPlayer, shootPlayer, updateBullets, updatePlayer } from './player.js';
import { drawAsteroid, handleCollisions, spawnAsteroids, updateAsteroids } from './asteroid.js';

const canvas = createCanvas(state);
const ctx = canvas.getContext('2d');
let lastTime = 0;

function resetGame() {
  state.player.x = 400;
  state.player.y = 300;
  state.player.speed = 0;
  state.player.angle = -Math.PI / 2;
  state.player.alive = true;
  state.player.cooldown = 0;
  state.asteroids = [];
  state.bullets = [];
  state.game.score = 0;
  state.game.lives = 3;
  state.game.started = true;
  state.game.over = false;
  spawnAsteroids(state, canvas);
}

function update(dt) {
  if (!state.game.started || state.game.over) return;

  updatePlayer(state, dt, canvas);
  updateAsteroids(state, dt, canvas);
  updateBullets(state, dt, canvas);
  handleCollisions(state);

  if (state.keys.Space) {
    shootPlayer(state);
  }
}

function drawScene() {
  clearScene(ctx, canvas);
  drawBackground(ctx, canvas);

  if (!state.game.started) {
    ctx.fillStyle = '#f9fafb';
    ctx.textAlign = 'center';
    ctx.font = '48px Arial';
    ctx.fillText('MASTEROID', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = '20px Arial';
    ctx.fillText('Press Enter to Start', canvas.width / 2, canvas.height / 2 + 20);
    ctx.font = '15px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('WASD to move  |  Space to shoot', canvas.width / 2, canvas.height / 2 + 55);
    ctx.textAlign = 'left';
    return;
  }

  state.asteroids.forEach((asteroid) => drawAsteroid(ctx, asteroid));
  drawBullets(ctx, state.bullets);
  drawPlayer(ctx, state.player, state.keys);

  ctx.fillStyle = '#f9fafb';
  ctx.font = '16px Arial';
  ctx.fillText(`Score: ${state.game.score}`, 16, 24);
  ctx.fillText(`Lives: ${state.game.lives}`, 16, 46);

  if (state.game.over) {
    ctx.fillStyle = 'rgba(2, 4, 10, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f9fafb';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '18px Arial';
    ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 16);
    ctx.textAlign = 'left';
  }
}

function gameLoop(timestamp) {
  const delta = Math.min((timestamp - lastTime) / 1000 || 0.016, 0.03);
  lastTime = timestamp;
  update(delta);
  drawScene();
  requestAnimationFrame(gameLoop);
}

setupInput(state);
window.addEventListener('keydown', (event) => {
  if (event.code === 'Enter' && (!state.game.started || state.game.over)) {
    event.preventDefault();
    resetGame();
  }
});

requestAnimationFrame(gameLoop);

export default state;

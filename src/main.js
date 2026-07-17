import './style.css';
import { state } from './state.js';
import { setupInput } from './input.js';
import { createCanvas, clearScene } from './renderer.js';
import { drawPlayer, updatePlayer } from './player.js';
import { drawAsteroid, spawnAsteroids, updateAsteroids } from './asteroid.js';

const canvas = createCanvas(state);
const ctx = canvas.getContext('2d');
let lastTime = 0;

function update(dt) {
  updatePlayer(state, dt, canvas);
  updateAsteroids(state, dt, canvas);
}

function drawScene() {
  clearScene(ctx, canvas);
  state.asteroids.forEach((asteroid) => drawAsteroid(ctx, asteroid));
  drawPlayer(ctx, state.player, state.keys);
}

function gameLoop(timestamp) {
  const delta = Math.min((timestamp - lastTime) / 1000 || 0.016, 0.03);
  lastTime = timestamp;
  update(delta);
  drawScene();
  requestAnimationFrame(gameLoop);
}

setupInput(state);
spawnAsteroids(state, canvas);
requestAnimationFrame(gameLoop);

export default state;

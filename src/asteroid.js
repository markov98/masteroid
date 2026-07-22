function createAsteroidShape(radius) {
  const points = [];
  const layers = 6 + Math.floor(Math.random() * 4);

  for (let i = 0; i < layers; i += 1) {
    const angle = (Math.PI * 2 * i) / layers;
    const offset = radius * (0.75 + Math.random() * 0.5);
    points.push({
      x: Math.cos(angle) * offset,
      y: Math.sin(angle) * offset,
    });
  }

  return points;
}

export function createAsteroid(x, y, radius = 40) {
  return {
    x,
    y,
    radius,
    angle: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 1.5,
    rotation: (Math.random() - 0.5) * 0.015,
    points: createAsteroidShape(radius),
  };
}

export function splitAsteroid(state, asteroid) {
  if (asteroid.radius > 14) {
    const count = 2;
    for (let i = 0; i < count; i += 1) {
      const childRadius = asteroid.radius * 0.55;
      const child = createAsteroid(asteroid.x, asteroid.y, childRadius);
      child.speed = asteroid.speed * 1.2 + Math.random() * 0.7;
      child.angle = asteroid.angle + (Math.PI / 8) * (i === 0 ? -1 : 1);
      state.asteroids.push(child);
    }
  }
}

function wrapAround(entity, canvas) {
  if (entity.x < -20) entity.x = canvas.width + 20;
  if (entity.x > canvas.width + 20) entity.x = -20;
  if (entity.y < -20) entity.y = canvas.height + 20;
  if (entity.y > canvas.height + 20) entity.y = -20;
}

export function spawnAsteroids(state, canvas, count = 5) {
  state.asteroids = [];

  for (let i = 0; i < count; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    if (Math.hypot(x - state.player.x, y - state.player.y) < 110) {
      i -= 1;
      continue;
    }

    state.asteroids.push(createAsteroid(x, y, 22 + Math.random() * 18));
  }
}

export function clearAsteroids(state) {
  state.asteroids.length = 0;
  state.bullets.length = 0;
  state.game.spawnTimer = 0;
}

export function updateAsteroids(state, dt, canvas) {
  if (!state.player.alive || state.game.over) {
    return;
  }

  state.game.spawnTimer -= dt;

  if (state.game.spawnTimer <= 0 && state.asteroids.length < 6) {
    state.game.spawnTimer = 1.5 + Math.random() * 1.2;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    if (Math.hypot(x - state.player.x, y - state.player.y) > 110) {
      state.asteroids.push(createAsteroid(x, y, 22 + Math.random() * 18));
    }
  }

  state.asteroids.forEach((asteroid) => {
    asteroid.x += Math.cos(asteroid.angle) * asteroid.speed * dt * 60;
    asteroid.y += Math.sin(asteroid.angle) * asteroid.speed * dt * 60;
    asteroid.angle += asteroid.rotation * dt * 60;
    wrapAround(asteroid, canvas);
  });
}

export function drawAsteroid(ctx, asteroid) {
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

export function handleCollisions(state) {
  for (let i = state.asteroids.length - 1; i >= 0; i -= 1) {
    const asteroid = state.asteroids[i];

    for (let j = state.bullets.length - 1; j >= 0; j -= 1) {
      const bullet = state.bullets[j];
      const distance = Math.hypot(asteroid.x - bullet.x, asteroid.y - bullet.y);

      if (distance <= asteroid.radius) {
        state.bullets.splice(j, 1);
        state.asteroids.splice(i, 1);
        splitAsteroid(state, asteroid);
        state.game.asteroidsDestroyed += 1;
        state.game.scoreMultiplier = 1 + Math.floor(state.game.asteroidsDestroyed / 10);
        const points = asteroid.radius > 20 ? 100 : 50;
        state.game.score += points * state.game.scoreMultiplier;
        break;
      }
    }
  }

  if (!state.player.alive) return;

  state.asteroids.forEach((asteroid) => {
    const distance = Math.hypot(asteroid.x - state.player.x, asteroid.y - state.player.y);
    if (distance <= asteroid.radius + state.player.radius) {
      state.player.alive = false;
      state.game.lives -= 1;
      state.player.x = 400;
      state.player.y = 300;
      state.player.speed = 0;
      state.player.angle = -Math.PI / 2;
      state.player.cooldown = 1;
      clearAsteroids(state);

      if (state.game.lives <= 0) {
        state.game.over = true;
        return;
      }

      setTimeout(() => {
        if (state.game.lives > 0) {
          state.player.alive = true;
          spawnAsteroids(state, { width: state.game.width, height: state.game.height });
        }
      }, 800);
    }
  });
}

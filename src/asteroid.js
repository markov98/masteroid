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

function wrapAround(entity, canvas) {
  if (entity.x < -20) entity.x = canvas.width + 20;
  if (entity.x > canvas.width + 20) entity.x = -20;
  if (entity.y < -20) entity.y = canvas.height + 20;
  if (entity.y > canvas.height + 20) entity.y = -20;
}

export function spawnAsteroids(state, canvas, count = 7) {
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

export function updateAsteroids(state, dt, canvas) {
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

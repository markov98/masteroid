const MAX_SPEED = 4.5;
const MIN_SPEED = -2.2;

export function updatePlayer(state, dt, canvas) {
  const player = state.player;
  player.cooldown = Math.max(0, player.cooldown - dt);

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

  player.speed = Math.max(MIN_SPEED, Math.min(player.speed, MAX_SPEED));
  player.x += Math.cos(player.angle) * player.speed;
  player.y += Math.sin(player.angle) * player.speed;

  wrapAround(player, canvas);
}

export function shootPlayer(state) {
  const player = state.player;
  if (player.cooldown > 0 || !player.alive) {
    return;
  }

  player.cooldown = 0.25;
  state.bullets.push({
    x: player.x + Math.cos(player.angle) * 24,
    y: player.y + Math.sin(player.angle) * 24,
    vx: Math.cos(player.angle) * 7.5,
    vy: Math.sin(player.angle) * 7.5,
    life: 1.2,
  });
}

function wrapAround(entity, canvas) {
  if (entity.x < -20) entity.x = canvas.width + 20;
  if (entity.x > canvas.width + 20) entity.x = -20;
  if (entity.y < -20) entity.y = canvas.height + 20;
  if (entity.y > canvas.height + 20) entity.y = -20;
}

export function drawPlayer(ctx, player, keys) {
  if (!player.alive) return;

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

  if (keys.KeyW || keys.ArrowUp) {
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

export function drawBullets(ctx, bullets) {
  ctx.fillStyle = '#fef3c7';
  bullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function updateBullets(state, dt, canvas) {
  state.bullets.forEach((bullet) => {
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    bullet.life -= dt;
    wrapAround(bullet, canvas);
  });

  state.bullets = state.bullets.filter((bullet) => bullet.life > 0);
}

const MAX_SPEED = 4.5;
const MIN_SPEED = -2.2;

export function updatePlayer(state, dt, canvas) {
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

  player.speed = Math.max(MIN_SPEED, Math.min(player.speed, MAX_SPEED));
  player.x += Math.cos(player.angle) * player.speed;
  player.y += Math.sin(player.angle) * player.speed;

  wrapAround(player, canvas);
}

function wrapAround(entity, canvas) {
  if (entity.x < -20) entity.x = canvas.width + 20;
  if (entity.x > canvas.width + 20) entity.x = -20;
  if (entity.y < -20) entity.y = canvas.height + 20;
  if (entity.y > canvas.height + 20) entity.y = -20;
}

export function drawPlayer(ctx, player, keys) {
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

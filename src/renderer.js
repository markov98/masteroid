export function createCanvas(state) {
  const app = document.getElementById('app');
  const canvas = document.createElement('canvas');
  canvas.width = state.game.width;
  canvas.height = state.game.height;
  canvas.className = 'game-canvas';
  app.appendChild(canvas);
  return canvas;
}

export function clearScene(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#04070f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 60; i += 1) {
    const x = (i * 97) % canvas.width;
    const y = (i * 53) % canvas.height;
    ctx.fillStyle = i % 3 === 0 ? '#4b5563' : '#6b7280';
    ctx.fillRect(x, y, 2, 2);
  }
}

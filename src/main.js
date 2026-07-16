const state = {
  player: {
    x: 0,
    y: 0,
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
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
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

export default state;

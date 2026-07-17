export function setupInput(state) {
  const trackKey = (event, value) => {
    if (event.code in state.keys) {
      state.keys[event.code] = value;
      event.preventDefault();
    }
  };

  window.addEventListener('keydown', (event) => {
    trackKey(event, true);
  });

  window.addEventListener('keyup', (event) => {
    trackKey(event, false);
  });
}

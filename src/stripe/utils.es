// This is needed because stripe tries to re-inject iframes
export const TIMEOUT = 100;
export const delay = (func) => setTimeout(func, TIMEOUT);

const destroyFrame = (frame) => {
  frame.removeAllListeners();
  frame._removeAllListeners();
  frame._iframe.remove();
};

const getFrames = (object) => ({
  mainFrame: object._controllerFrame, // kek
  frames: object._frames,
});

export const destroyStripeControllers = (stripe) => {
  if (!stripe || !stripe._controller) return;
  const { mainFrame, frames } = getFrames(stripe._controller);

  destroyFrame(mainFrame);
  Object.keys(frames).forEach((key) => destroyFrame(frames[key]));
  delete stripe._controller;
};

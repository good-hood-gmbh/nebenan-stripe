// This is needed because stripe tries to re-inject iframes
export const TIMEOUT = 100;

const noop = () => {};

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

export const disableStripeTracking = (stripe) => {
  if (!stripe || !stripe._ec) return null;

  const { mainFrame } = getFrames(stripe._ec);

  const original = mainFrame.send;
  mainFrame.send = noop;
  return original;
};

export const restoreStripeTracking = (stripe, original) => {
  if (!stripe || !stripe._ec) return;
  const { mainFrame } = getFrames(stripe._ec);
  mainFrame.send = original;
};

export const destroyStripeControllers = (stripe) => {
  if (!stripe || !stripe._controller) return;
  const { mainFrame, frames } = getFrames(stripe._controller);

  destroyFrame(mainFrame);
  Object.keys(frames).forEach((key) => destroyFrame(frames[key]));
  delete stripe._controller;
};

export const destroyStripeMetrics = (stripe) => {
  if (!stripe || !stripe._ec) return;
  const { mainFrame } = getFrames(stripe._ec);
  destroyFrame(mainFrame);
  delete stripe._ec;
};

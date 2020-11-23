export const bindTo = (context, ...funcs) => funcs.forEach((func) => {
  if (context[func]) context[func] = context[func].bind(context);
});

export const invoke = (fn, ...args) => {
  if (typeof fn === 'function') return fn(...args);
};

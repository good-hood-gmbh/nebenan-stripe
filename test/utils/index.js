const { assert } = require('chai');
const sinon = require('sinon');

const {
  bindTo,
  invoke,
} = require('../../lib/utils');


describe('utils', () => {
  it('bindTo', () => {
    const obj = {
      handler() { return this; },
      anotherHandler() { return this; },
    };

    bindTo(obj, 'handler', 'anotherHandler', 'unexistend');

    const result1 = obj.handler();
    const result2 = obj.anotherHandler();

    assert.deepEqual(result1, obj, 'bound 1st func');
    assert.deepEqual(result2, obj, 'bound 2nd func');
  });

  it('invoke', () => {
    const func = (first, second) => second;
    const spy = sinon.spy();
    invoke(spy);
    assert.isUndefined(invoke(), 'empty call does nothing');
    assert.isTrue(spy.calledOnce, 'called');
    assert.equal(invoke(func, 'a', 'b'), 'b', 'passes down args properly');
  });
});

import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { bindTo, invoke } from 'nebenan-helpers/lib/utils';


class StripeComponent extends PureComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'validate',
      'setError',
      'handleChange',
    );
    this.state = this.getDefaultState(props);
  }

  componentDidMount() {
    this.isComponentMounted = true;
    if (this.isConnected()) this.context.form.addInput(this);
  }

  componentWillUnmount() {
    if (this.isConnected()) this.context.form.removeInput(this);
    this.isComponentMounted = false;
  }

  getDefaultState() {
    return {
      isPristine: true,
      error: null,
    };
  }

  getDefaultOptions() {
    return {
      style: {
        base: {
          fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
          fontSize: '14px',
          lineHeight: 1.3,
        },
        invalid: {
          color: 'inherit',
        },
      },
    };
  }

  getError() {
    return this.state.error;
  }

  getName() {
    return this.props.name;
  }

  // Override this method for bank components
  getValue() {
    return this.props.stripe.createToken();
  }

  // this method is a no-op and needed for integration purposes only
  setValue() {}

  setError(error, done) {
    if (!this.isComponentMounted) return;
    const isPristine = false;

    const complete = () => {
      invoke(this.props.onError, this.getError());
      if (this.isConnected()) this.context.form.updateValidity();
      invoke(done);
    };

    this.setState({ isPristine, error }, complete);
  }

  setPristine(done) {
    if (!this.isComponentMounted) return;
    const updater = (state, props) => this.getDefaultState(props);
    this.setState(updater, done);
  }

  isConnected() {
    return Boolean(this.context.form && this.getName());
  }

  isValid() {
    return !this.state.error;
  }

  isPristine() {
    return this.state.isPristine;
  }

  validate() {
    // Stripe doesn't have an API to trigger validation
    return this.isValid() ? Promise.resolve() : Promise.reject();
  }

  reset(done) {
    this.setPristine(done);
  }

  handleChange(payload) {
    const message = payload.error ? payload.error.message : null;
    const complete = () => invoke(this.props.onUpdate, payload);
    this.setError(message, complete);
  }
}

StripeComponent.contextTypes = {
  form: PropTypes.object,
};

StripeComponent.propTypes = {
  stripe: PropTypes.object.isRequired,
  name: PropTypes.string,

  onUpdate: PropTypes.func,
  onError: PropTypes.func,
};

export default StripeComponent;

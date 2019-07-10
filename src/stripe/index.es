import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Script from 'react-load-script';
import { StripeProvider } from 'react-stripe-elements';

import { delay, destroyStripeControllers } from './utils';


const url = 'https://js.stripe.com/v3/';

// FYI: use only one <Stripe> per form. It will work with more, but consume more memory.
class Stripe extends PureComponent {
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.state = this.getDefaultState();
  }

  componentWillUnmount() {
    const cleanup = () => {
      destroyStripeControllers(this.stripe);
      delete this.stripe;
    };
    delay(cleanup);
  }

  getDefaultState() {
    return {
      ready: false,
    };
  }

  handleLoad() {
    this.stripe = global.Stripe(this.props.token);
    this.setState({ ready: true }, this.props.onLoad);
  }

  renderContent() {
    if (!this.state.ready) return null;

    // Idiotic StripeProvider requires content to be a single child
    return (
      <StripeProvider stripe={this.stripe}>
        <Fragment>{this.props.children}</Fragment>
      </StripeProvider>
    );
  }

  render() {
    const { onError } = this.props;
    const content = this.renderContent();
    return (
      <Fragment>
        <Script {...{ url, onError }} onLoad={this.handleLoad} />
        {content}
      </Fragment>
    );
  }
}

Stripe.propTypes = {
  children: PropTypes.node,
  onLoad: PropTypes.func,
  onError: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default Stripe;

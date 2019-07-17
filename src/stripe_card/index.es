import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { CardElement } from 'react-stripe-elements';

import connectStripe from '../connect';
import StripeComponent from '../base';


class StripeCard extends StripeComponent {
  getValue() {
    return this.props.stripe.createPaymentMethod('card');
  }

  getPaymentConfirmation(secret) {
    return this.props.stripe.handleCardAction(secret);
  }

  render() {
    const { label, children } = this.props;
    const error = this.getError();

    const className = classNames('c-stripe_card', this.props.className);
    const inputClassName = classNames('ui-input', { 'ui-input-error': error });
    const paymentProps = this.getDefaultOptions();

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let errorNode;
    if (error) errorNode = <em className="ui-error">{error}</em>;

    return (
      <label className={className}>
        {labelNode}
        <CardElement {...paymentProps} className={inputClassName} onChange={this.handleChange} />
        {children}
        {errorNode}
      </label>
    );
  }
}

StripeCard.propTypes = {
  ...StripeComponent.propTypes,
  className: PropTypes.string,
  children: PropTypes.node,

  label: PropTypes.node,
};

export default connectStripe(StripeCard);

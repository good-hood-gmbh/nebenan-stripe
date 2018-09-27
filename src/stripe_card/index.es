import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { CardElement } from 'react-stripe-elements';
import { connectStripe, StripeComponent } from '../stripe';


class StripeCard extends StripeComponent {
  render() {
    const { label, children } = this.props;
    const error = this.getError();

    const className = classNames('c-stripe_card', this.props.className);
    const inputClassName = classNames('ui-input', { 'ui-input-error': error });
    const options = this.getDefaultOptions();

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let errorNode;
    if (error) errorNode = <em className="ui-error">{error}</em>;

    return (
      <label className={className}>
        {labelNode}
        <CardElement
          {...options}
          onChange={this.handleChange}
          className={inputClassName}
        />
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

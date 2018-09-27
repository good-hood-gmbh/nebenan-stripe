import config from 'uni-config';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { IbanElement } from 'react-stripe-elements';
import { connectStripe, StripeComponent } from '../stripe';

const { iban: ibanConfig } = config.client.stripe;


class StripeIBAN extends StripeComponent {
  getValue() {
    const { owner } = this.props;

    const options = {
      owner,
      type: 'sepa_debit',
      currency: 'eur',
      mandate: {
        notification_method: 'manual',
      },
    };

    return this.props.stripe.createSource(options);
  }

  render() {
    const { label, children } = this.props;
    const error = this.getError();

    const className = classNames('c-stripe_iban', this.props.className);
    const inputClassName = classNames('ui-input', { 'ui-input-error': error });
    const options = { ...this.getDefaultOptions(), ...ibanConfig };

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let errorNode;
    if (error) errorNode = <em className="ui-error">{error}</em>;

    return (
      <label className={className}>
        {labelNode}
        <IbanElement
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

StripeIBAN.propTypes = {
  ...StripeComponent.propTypes,
  className: PropTypes.string,
  children: PropTypes.node,

  owner: PropTypes.object.isRequired,

  label: PropTypes.node,
};

export default connectStripe(StripeIBAN);

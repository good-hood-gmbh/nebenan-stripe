import PropTypes from 'prop-types';
import clsx from 'clsx';

import { IbanElement } from 'react-stripe-elements';

import connectStripe from '../connect';
import StripeComponent from '../base';


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
    const { label, options, children } = this.props;
    const error = this.getError();

    const className = clsx('c-stripe_iban', this.props.className);
    const inputClassName = clsx('ui-input', { 'ui-input-error': error });
    const paymentProps = { ...this.getDefaultOptions(), ...options };

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let errorNode;
    if (error) errorNode = <em className="ui-error">{error}</em>;

    return (
      <label className={className}>
        {labelNode}
        <IbanElement {...paymentProps} className={inputClassName} onChange={this.handleChange} />
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
  options: PropTypes.object.isRequired,

  label: PropTypes.node,
};

export default connectStripe(StripeIBAN);

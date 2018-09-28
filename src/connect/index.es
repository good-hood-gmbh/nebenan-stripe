import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Elements, injectStripe } from 'react-stripe-elements';

const cssSrc = 'https://fonts.googleapis.com/css?family=Open+Sans';
const fonts = [{ cssSrc }];


export default (WrappedComponent) => {
  const InjectedComponent = injectStripe(WrappedComponent, { withRef: true });
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class StripeForm extends PureComponent {
    getWrappedInstance() {
      return this.proxiedRef.getWrappedInstance();
    }

    getValue() {
      return this.getWrappedInstance().getValue();
    }

    render() {
      const { localeData: data } = this.context;
      return (
        <Elements locale={data.type} fonts={fonts}>
          <InjectedComponent {...this.props} ref={(el) => { this.proxiedRef = el; }} />
        </Elements>
      );
    }
  }

  StripeForm.contextTypes = {
    localeData: PropTypes.object,
  };

  StripeForm.displayName = `StripeForm(${displayName})`;
  StripeForm.WrappedComponent = WrappedComponent;

  return StripeForm;
};

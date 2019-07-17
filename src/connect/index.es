import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Elements, injectStripe } from 'react-stripe-elements';

const cssSrc = 'https://fonts.googleapis.com/css?family=Open+Sans';
const fonts = [{ cssSrc }];


const connectStripe = (Component) => {
  const WithReference = ({ forwardedRef, ...props }) => <Component {...props} ref={forwardedRef} />;
  const WithStripe = injectStripe(WithReference);

  const WithElements = (props, context) => {
    const locale = context.localeData && context.localeData.type;
    return <Elements {...{ locale, fonts }}><WithStripe {...props} /></Elements>;
  };

  WithElements.contextTypes = {
    localeData: PropTypes.object,
  };

  const displayName = Component.displayName || Component.name || 'Component';
  const WrappedComponent = (props, ref) => <WithElements {...props} forwardedRef={ref} />;
  WrappedComponent.displayName = `connectStripe(${displayName})`;
  WrappedComponent.WrappedComponent = Component;

  return forwardRef(WrappedComponent);
};

export default connectStripe;

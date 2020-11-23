import { forwardRef } from 'react';
import { useLocale } from 'i18n-polyglot';

import { Elements, injectStripe } from 'react-stripe-elements';

const cssSrc = 'https://fonts.googleapis.com/css?family=Open+Sans';
const fonts = [{ cssSrc }];


const connectStripe = (Component) => {
  const WithReference = ({ forwardedRef, ...props }) => <Component {...props} ref={forwardedRef} />;
  const WithStripe = injectStripe(WithReference);

  const WrappedComponent = (props, ref) => {
    const locale = useLocale()?.type;
    return (
      <Elements {...{ locale, fonts }}>
        <WithStripe {...props} forwardedRef={ref} />
      </Elements>
    );
  };

  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `connectStripe(${displayName})`;
  WrappedComponent.WrappedComponent = Component;

  return forwardRef(WrappedComponent);
};

export default connectStripe;

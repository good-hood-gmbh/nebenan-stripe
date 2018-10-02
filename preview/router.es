import React from 'react';
import Route from 'react-router/lib/Route';

import Error404 from './containers/error404';
import Index from './containers/index';

import Stripe from './containers/stripe';

export default () => (
  <div>
    <Route path="/" component={Index} />

    <Route path="/stripe" component={Stripe} />

    <Route path="*" component={Error404} />
  </div>
);

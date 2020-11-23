import { Switch, Route } from 'react-router-dom';

import Error404 from './containers/error404';
import Index from './containers/index';

import Stripe from './containers/stripe';

export default () => (
  <Switch>
    <Route path="/" component={Index} exact />

    <Route path="/stripe" component={Stripe} />

    <Route component={Error404} />
  </Switch>
);

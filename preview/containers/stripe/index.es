import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import Header from '../../components/header';

import Stripe from '../../../lib/stripe';
import StripeCard from '../../../lib/stripe_card';
import StripeIBAN from '../../../lib/stripe_iban';


class StripePreview extends PureComponent {
  constructor(props) {
    super(props);

    this.handleUpdateToken = this.handleUpdateToken.bind(this);
    this.handleCard = this.handleCard.bind(this);
    this.handleIban = this.handleIban.bind(this);

    this.card = createRef();
    this.iban = createRef();

    this.state = {
      token: 'pk_test_whatever',
    };
  }

  getChildContext() {
    return {
      localeData: {
        type: 'de',
      },
    };
  }

  handleUpdateToken(event) {
    const token = event.target.value;
    this.setState({ token });
    console.warn('Got token', token);
  }

  handleCard() {
    const complete = (...args) => console.warn('card', ...args);
    console.warn('attempting to tokenize card');
    this.card.current.getValue().then(complete).catch(complete);
  }

  handleIban() {
    const complete = (...args) => console.warn('iban', ...args);
    console.warn('attempting to tokenize iban');
    this.iban.current.getValue().then(complete).catch(complete);
  }

  handleError(...args) {
    console.warn('Stripe Error:', ...args);
  }

  render() {
    const { token } = this.state;

    const owner = {
      name: 'Peter Parker',
      email: 'captainspiderman@marvel.com',
    };

    const ibanOptions = {
      placeholderCountry: 'DE',
      supportedCountries: ['SEPA'],
    };

    return (
      <article className="preview-markdown">
        <Header>Stripe</Header>

        <div className="preview-section">
          <label className="ui-label">Enter token
            <input
              className="ui-input" type="text"
              value={token} onChange={this.handleUpdateToken}
            />
          </label>
        </div>

        <Stripe token={token} onError={this.handleError} key={token}>
          <div className="preview-section">
            <StripeCard ref={this.card} label="Credit card" />
            <p>
              <span className="ui-button ui-button-primary" onClick={this.handleCard}>Pay</span>
            </p>
          </div>

          <div className="preview-section">
            <StripeIBAN
              ref={this.iban} label="Bank account"
              owner={owner}
              options={ibanOptions}
            />
            <p>
              <span className="ui-button ui-button-primary" onClick={this.handleIban}>Pay</span>
            </p>
          </div>
        </Stripe>
      </article>
    );
  }
}

StripePreview.childContextTypes = {
  localeData: PropTypes.object,
};

export default StripePreview;

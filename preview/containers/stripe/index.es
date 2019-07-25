import React, { PureComponent, createRef } from 'react';
import International from 'nebenan-react-hocs/lib/i18n';

import { bindTo } from '../../../lib/utils';

import Header from '../../components/header';

import Stripe from '../../../lib/stripe';
import StripeCard from '../../../lib/stripe_card';
import StripeIBAN from '../../../lib/stripe_iban';

const staticLocale = {
  type: 'de',
  dictionary: {},
};


class StripePreview extends PureComponent {
  constructor(props) {
    super(props);

    bindTo(this,
      'handleUpdateToken',
      'handleCard',
      'handleCardSecurity',
      'handleIban',
    );

    this.secret = createRef();
    this.card = createRef();
    this.iban = createRef();

    this.state = {
      token: 'pk_test_whatever',
    };
  }

  handleUpdateToken(event) {
    const token = event.target.value;
    this.setState({ token });
    console.warn('Got token', token);
  }

  handleCard() {
    const complete = (...args) => console.warn('card', ...args);
    console.warn('attempting to get payment token for the card');
    this.card.current.getValue().then(complete).catch(complete);
  }

  handleCardSecurity() {
    const { value: secret } = this.secret.current;
    const complete = (...args) => console.warn('cardSecurity', ...args);
    console.warn('attempting to get through card security using secret', secret);
    this.card.current.getPaymentConfirmation(secret).then(complete).catch(complete);
  }

  handleIban() {
    const complete = (...args) => console.warn('iban', ...args);
    console.warn('attempting to get payment source for the iban');
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
      <International locale={staticLocale}>
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

          <div className="preview-section">
            <label className="ui-label">Client secret for card security
              <input className="ui-input" type="text" ref={this.secret} />
            </label>
          </div>

          <Stripe token={token} onError={this.handleError} key={token}>
            <div className="preview-section">
              <StripeCard ref={this.card} label="Credit card" />
              <p>
                <span className="ui-button ui-button-primary" onClick={this.handleCard}>Pay with card</span>
                <span className="ui-button ui-button-danger" onClick={this.handleCardSecurity}>Test card security</span>
              </p>
            </div>

            <div className="preview-section">
              <StripeIBAN
                ref={this.iban} label="Bank account"
                owner={owner}
                options={ibanOptions}
              />
              <p>
                <span className="ui-button ui-button-primary" onClick={this.handleIban}>Pay with IBAN</span>
              </p>
            </div>
          </Stripe>
        </article>
      </International>
    );
  }
}

export default StripePreview;

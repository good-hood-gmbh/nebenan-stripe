require('babel-register')({ extensions: ['.es'] });
const app = require('express')();
const statis = require('serve-static');
const morgan = require('morgan');

const React = require('react');
const { renderToString } = require('react-dom/server');

const match = require('react-router/lib/match');
const RouterContext = require('react-router/lib/RouterContext');
const createRouter = require('./router').default;
const Error404 = require('./containers/error404').default;
const MicroHelmet = require('../lib/micro_helmet').default;

const port = parseInt(process.env.PORT, 10) || 3000;

const getHTML = (meta, content) => (`<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${meta && meta.title ? meta.title : 'React Nebenan UI Components'}</title>
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, width=device-width, shrink-to-fit=no" />
    <meta name="HandheldFriendly" content="True" />
    <meta name="MobileOptimized" content="320" />
    <meta name="format-detection" content="telephone=no" />
    <meta http-equiv="cleartype" content="on" />
    <link rel="stylesheet", href="/style.css" />
  </head>
  <body>
    <main id="main">${content}</main>
    <script src="/script.js" async></script>
  </body>
</html>
`);

const renderApp = (req, res, next) => {
  const renderPage = (props) => {
    const statusCode = props.components.includes(Error404) ? 404 : 200;

    const Component = React.createElement(RouterContext, props);
    const content = renderToString(Component);
    const meta = MicroHelmet.rewind();

    res.status(statusCode).send(getHTML(meta, content));
  };

  const matchPage = (error, redirect, props) => {
    if (error) {
      console.log(`Request ${req.url} failed to route:`, error.message);
      return next();
    }

    if (redirect) return res.redirect(302, `${redirect.pathname}${redirect.search}`);

    // if there was no props, this request isn't handled by FE explicitly
    if (!props) return next();

    renderPage(props);
  };

  const routes = createRouter();
  match({ routes, location: req.url }, matchPage);
};

app.set('port', port);

const emojis = statis(`${__dirname}/../node_modules/emojione-assets/png/`, { redirect: false });
app.use(morgan('dev'));
app.use(statis(`${__dirname}/public`, { redirect: false }));
app.use('/images/emojis-v4.0.0', emojis);

app.use(renderApp);
app.get('*', (req, res) => res.send('Unhandled request'));
app.use(require('errorhandler')({ dumpExceptions: true, showStack: true }));

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

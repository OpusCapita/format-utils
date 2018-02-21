import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import FormatUtilsExamples from './format-utils-examples/format-utils-examples';

import './app.component.scss';
import './images/favicon.ico';

const renderApp = (Component) => {
  render(
    <AppContainer>
      <Router>
        <Route path="/" component={Component} />
      </Router>
    </AppContainer>,
    document.getElementById('oc-examples'),
  );
};

renderApp(FormatUtilsExamples);

// Webpack Hot Module Replacement API
/* eslint-disable global-require */
if (module.hot) {
  module.hot.accept('./format-utils-examples/format-utils-examples', () => {
    const Comp = require('./format-utils-examples/format-utils-examples').default;
    renderApp(Comp);
  });
}

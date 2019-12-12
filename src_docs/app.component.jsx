import { hot } from 'react-hot-loader/root';
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import FormatUtilsExamples from './format-utils-examples/format-utils-examples';

import './app.component.scss';
import './images/favicon.ico';

class App extends React.PureComponent {
  render() {
    return (
      <Router>
        <Route path="/" component={FormatUtilsExamples} />
      </Router>
    );
  }
}

export default hot(App);

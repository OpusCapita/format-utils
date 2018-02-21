import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import FormatUtilsExamples from './format-utils-examples/format-utils-examples';

import './app.component.scss';

render(
  <Router history={hashHistory}>
    <Route path="/" component={FormatUtilsExamples} />
  </Router>,
  document.getElementById('oc-examples'),
);

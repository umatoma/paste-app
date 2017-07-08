import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Board from './Board';

const Routes = props => (
  <Router {...props}>
    <Route path="/boards/:boardId" component={Board} />
  </Router>
);

export default Routes;

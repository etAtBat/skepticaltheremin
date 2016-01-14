var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var routes = require('./config/routes');
var browserHistory = Router.browserHistory;


ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
)

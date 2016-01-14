var React = require('react');
var Main = require('../components/Main');
var Home = require('../components/Home');
var Login = require('../components/Login');
var Signup = require('../components/Signup');
var Router = require('react-router');
var Route = Router.Route;
var IndexRoute = Router.IndexRoute;
var MapApp = require('../components/MapApp');
    // <IndexRoute component={Home} />

var MainPage = require('../components/MainPage');

module.exports = (
  <Route path="/" component={MainPage}>
    <IndexRoute component={MainPage} />
    <Route name="login" path="login" component={Login} />
    <Route name='mainpage' path='mainpage' component={MainPage} />
  </Route>
);


/** DELTED OUT **/
// <Route name="home" path="home" component={Home} />
// <Route name="map" path="map" component={MapApp} />
// <Route name="signup" path="signup" component={Signup} />

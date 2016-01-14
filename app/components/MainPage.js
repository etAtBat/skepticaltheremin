var React = require('react');
var NavBar = require('./NavBar');
var MapApp = require('./MapApp');

var MainPage = React.createClass({

  render() {
    return (
      <div>
        <NavBar />
        <div>Hello World</div>
        <MapApp />
      </div>
    );
  }
});

module.exports = MainPage;

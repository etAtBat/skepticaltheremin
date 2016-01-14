var React = require('react');
var NavBar = require('./NavBar');
var MapApp = require('./MapApp');

var MainPage = React.createClass({

  getInitialState: function() {
    // makes a get request to server user story data
    var state = /*GET request to server sending user array of objects [{}, {}, {}]*/ { storyNames:['Hello', 'World'] };
    return state;
  },

  getUserStory: function(storyName) {
    console.log(storyName);
  },

  render() {
    return (
      <div class='container'>
        <NavBar options={this.state} getUserStory={this.getUserStory}/>
        <MapApp />
      </div>
    );
  }
});

module.exports = MainPage;

var React = require('react');
var NavBar = require('./NavBar');
var MapApp = require('./MapApp');
var helpers = require('../utils/helpers');

var MainPage = React.createClass({
  getInitialState: function() {
    // makes a get request to server user story data
    // var state = GET request to server sending user array of objects [{}, {}, {}] { storyNames:['Hello', 'World'] };
    return {userid : 1};
  },

  componentDidMount: function() {
    helpers.getAllStories(this.state.userid, function(data) {
      if (this.isMounted()) {
        var storyArray = data.storyName.map(function(storyObj) {
          console.log(storyObj);
          return storyObj.name;
        });

        this.setState({
          storyNames: storyArray
          }
        );
      }

    }.bind(this));
  },

  getUserStory: function(storyName) {
    console.log(storyName);
  },


  render() {
    return (
      <div className='container'>
        <NavBar options={this.state} getUserStory={this.getUserStory}/>
        <MapApp />
      </div>
    );
  }
});

module.exports = MainPage;

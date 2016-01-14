var React = require('react');
var DropDownList = require('./DropDownList');

var NavBar = React.createClass({
  // NavBar has two components, a button for logout and StoryNav button
  //    <DropDownList />
  // Placeholder: insert these components

  render() {
    return (
      <div className="main-container">
        <nav className="navbar navbar-fixed-top navbar-inverse" role="navigation" >
          <div className="col-sm-7 col-sm-offset-2">
            <div className="container">
            <div><DropDownList /></div>
            </div>
          </div>
        </nav>
        <div className="container">
          {/*this.props.children*/}
        </div>
      </div>
    );
  }
});

module.exports = NavBar;

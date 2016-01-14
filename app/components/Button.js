var React = require('react');

// define a react componenet class
var Button = React.createClass({

  render: function() {
    return (
      <button type="button" className="navbar-toggle button-default"  onClick={this.props.whenClicked}
                data-toggle="collapse" data-target=".navbar-collapse">
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
    );
  }
});

module.exports = Button;

var React = require('react');
var Button = require('./Button');

var DropDownList = React.createClass({

  handleClick: function() {
    this.setState({open: !this.state.open});

  },

  getInitialState: function() {
    return { open : false };
  },

  handleItemClick: function(item) {
    this.setState({
      open: false,
      itemTitle: item
    });
  },

  render() {

    return (
      <div>
      <div className='navbar-header'>
        <Button whenClicked={this.handleClick} />
        <a class="navbar-brand" href='#'>StoryMap</a>
      </div>

        <ul className={'dropdown-menu ' + (this.state.open ? 'show' : '')}>
          <li><a>Add Story</a></li>
          <li>
            <a>
              <div>My Stories</div>
            </a>
          </li>
          <li><a href='/logout'>Logout</a></li>
        </ul>
      </div>
    );
  }
});

module.exports = DropDownList;

//{'dropdown-menu ' + (this.state.open ? 'show' : '') }

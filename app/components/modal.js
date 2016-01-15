var React = require('react');

module.exports = React.createClass({

  getInitialState(){

    var favorites = [];

    return {
      // Connected to the location input
      location: this.props.address,
      storyList:[],
      storyName: '',
      breadcrumbs: [],
      lat: this.props.lat,
      lng: this.props.lng,
      previousMarker: null,
      currentMarker: null,
      lastMarkerTimeStamp: null,
      map: null
    }
  },

  render() {
    return (
      <div>
        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog">

            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Modal Header</h4>
              </div>

              <div className="modal-body">

                <div class="form-group">
                  <label for="location">Location:</label>
                  <input type="text" className="form-control" id="location" />
                </div>

                <div class="form-group">
                  <label for="comment">Comment:</label>
                  <textarea className="form-control" rows="5" id="comment"></textarea>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

});

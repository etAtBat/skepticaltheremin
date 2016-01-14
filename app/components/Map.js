var React = require('react');
var helpers = require('../utils/helpers');

var Map = React.createClass({
  getInitialState(){

    var favorites = [];

    return {
      // Connected to the location input
      location: '',
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
  
  // Change event from the location input
  handleLocationChange(e) {
    this.setState({location: e.target.value});  
  },
 
  // Grabs the comments from the comment textarea 
  handleCommentChange(e) {
    this.setState({comment: e.target.value});
  },

  // Handles the Stories changes
  handleStoryChange(e) {
    this.setState({"storyName": e.target.value})
  },

  matchBreadCrumb(timestamp){
    var breadcrumbs = this.props.favorites;
    for(var i = breadcrumbs.length - 1; i >= 0; i--){
      var breadcrumb = breadcrumbs[i];
      if(breadcrumb.timestamp === timestamp){
        this.setState({location: breadcrumb.location, comment: breadcrumb.details.note})
        return;
      }
    }

  },

  toggleFavorite(address){
    this.props.onFavoriteToggle(address);
  },

  addFavBreadCrumb(id, lat, lng, timestamp, details, infoWindow, location) {
    this.props.onAddToFavBcs(id, lat, lng, timestamp, details, infoWindow, location);
  },

  updateCurrentLocation(){
    if(this.state.previousMarker){
      this.state.previousMarker.setIcon({
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        strokeColor: "red",
        scale: 5
      });
    }
    this.state.currentMarker.setIcon({
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      strokeColor: "green",
      scale: 5
    });
    this.state.previousMarker = this.state.currentMarker;
  },

  componentDidMount(){

    // Only componentDidMount is called when the component is first added to
    // the page. This is why we are calling the following method manually. 
    // This makes sure that our map initialization code is run the first time.

    // this.componentDidUpdate();
    var self = this;
    var map = new GMaps({
      el: '#map',
      lat: this.props.lat,
      lng: this.props.lng,
      styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]

    });

    this.setState({map: map});

    //Right Click Menu
    map.setContextMenu({
      control: 'map',
      options: [{
        title: 'Add Bread Crumb',
        name: 'add_bread_crumb',
        action: function(e) {

          // WHEN THE MAP IS RIGHT CLICKED
          var addressString = e.latLng.lat().toString() + " " +  e.latLng.lng().toString();
          
          // UPDATE TO NEW LOCATION. RERENDERS THE PARENT COMPONENT WHICH THEN RERENDERS THIS COMPONENT UPDATING THE PROPS TO THE NEW RIGHT CLICKED LOCATION
          // PASSES THE LG AND LT TO SEARCHADDRESS IN MAPAPP
          // MAPAPP PASSES IT TO THIS FILE HERE AND PASSES IT TO THE LOCATION INPUT
          self.props.searchAddress(addressString, function(newLocation){
            self.setState({location: newLocation, comment: "Add comments here and save breadcrumb"});
          });

          var id = self.props.favorites.length;

          // Time on when the map was clicked
          var time = Date.now();
          self.setState({lastMarkerTimeStamp: time});
          

          // ADD THE CONNECTION FOR DIFFERENT MARKS HERE
          var marker = this.addMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            title: 'New marker',
            id: id,
            timestamp: time,
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              strokeColor: "green",
              scale: 5
            },
            // infoWindow: {
            //   content: '<p style="height:200px; width: 800px;">HTML Content </p>'
            // },
            click: function(e) {
              self.setState({currentMarker: this});
              self.updateCurrentLocation();
              self.matchBreadCrumb(e.timestamp);
              // this.setMap(null);
            }
          });
          self.setState({currentMarker: marker});
          self.updateCurrentLocation();
          // self.addFavBreadCrumb(id, e.latLng.lat(), e.latLng.lng(), Date.now(), {note: "I LOVE this place."}, {content: '<p>Dat info dohhh</p>'});
        }
      }, {
        title: 'Center here',
        name: 'center_here',
        action: function(e) {
          this.setCenter(e.latLng.lat(), e.latLng.lng());
        }
      }]
    });

    

    // map.addMarkers(this.props.favorites); //no longer used
    helpers.getAllBreadCrumbs(this.props.user, function(data){
      if(!data){
        return;
      }
      self.setState({breadcrumbs: data.pins});
      self.state.breadcrumbs.forEach(function(favorite, index){
        map.addMarker({
          lat: favorite.lat,
          lng: favorite.lng,
          title: 'New marker',
          id: index,
          timestamp: favorite.timestamp,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            strokeColor: "red",
            scale: 5
          },
          click: function(e) {
            self.setState({currentMarker: this});
            self.updateCurrentLocation();
            self.matchBreadCrumb(e.timestamp);
            // self.state.currentMarker.setMap(null);
          }
        });

      });
    });

  },

  componentDidUpdate(){
    if(this.props.favorites.length !== this.state.breadcrumbs.length){
      this.setState({breadcrumbs: this.props.favorites});
      return;
    }
    if(this.lastLat == this.props.center.lat && this.lastLng == this.props.center.lng){

      // The map has already been initialized at this address.
      // Return from this method so that we don't reinitialize it
      // (and cause it to flicker).

      return;
    }

    this.state.map.setCenter(this.props.center.lat, this.props.center.lng);
    this.lastLat = this.props.center.lat;
    this.lastLng = this.props.center.lng

  },



  gatherAllStories(){
    // Get the lat and lng from MAP Apps SEARCH COMPONENT
    var lat = this.props.lat;
    var lng = this.props.lng;
    var timestamp = this.state.lastMarkerTimeStamp;
    var location = this.state.location;
    var comment = this.state.comment;
    var storyName = this.state.storyName;


    
    // Prepare the object and send it to the server
    // LAT AND LNG CAN BE EITHER FROM THE SEARCH COMPONENET OR FROM THE RIGHT CLICK FEATRUE FROM GMAPS. THIS IS BECAUSE SEARCHADRESS IS INVOKED
    var pinObject = {
      latitude: lat,
      longitutde: lng,
      time: timestamp,

      // The address for the pin
      location: location,

      // Comment relating to that pin
      comment: comment,

      // The stories name
      name: storyName
    };

    // Update the pin on the map

    // Updating the state with the the pins that are making up a story
    this.setState({"storyList": this.state.storyList.push(pinObject) && this.state.storyList });
    this.setState({location: '', comment: ''});
  },

  submitStory(){

    // Call the StoryList function
    this.props.addNewStory(this.state.storyList);
    this.setState({location: '', comment: '', "storyName": '', "storyList": []});
  },


  // handleSubmit(e) {

  //   e.preventDefault();

  //   if(this.state.location === '' || this.state.comment === ''){
  //     // Bring a pop up of some sort
  //     return;
  //   }
    
  //   var id = this.props.favorites.length;
  //   var timestamp = this.state.lastMarkerTimeStamp;
  //   this.addFavBreadCrumb(id, this.props.lat, this.props.lng, timestamp, {note: this.state.comment}, this.state.location);
  //   // this.state.currentMarker.setMap(null);


  // },

  render(){

    return (
      <div>

        <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Modal</button>

      
          <div class="modal fade" id="myModal" role="dialog">
            <div class="modal-dialog">
          
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Modal Header</h4>
                </div>
                <div class="modal-body">
                  <p>Some text in the modal.</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
              
            </div>
          </div>

          {/* <Modal /> */}

        <div className="map-holder">
          <p>Loading......</p>
          <div id="map"></div>
        </div>

        <form className="form-group list-group col-xs-12 col-md-6 col-md-offset-3" >
          <label htmlFor="location">Location:</label>
          <input type="text" className="form-control" id="location" onChange={this.handleLocationChange} value={this.state.location} placeholder="Location" />


          {/*Story Title*/}
          <label htmlFor="storyName"  >Story-Title:</label>

          <input type="text" disabled={ this.state.storyList.length > 0 ? true : false } className="form-control" id="storyName" onChange={this.handleStoryChange} value={this.state.storyName} placeholder="Late Night Adventures" />


          
          {/*Comment Box*/}
          <label htmlFor="comment">Comment:</label>
          <textarea value={this.state.comment} onChange={this.handleCommentChange} className="form-control" rows="10" id="comment"></textarea>

          <div>
            <input type='button' onClick={this.gatherAllStories} className='btn btn-success' value='Add New Story'/>
            <input type="button" onClick={this.submitStory} className="btn btn-primary" value="Sumbit Story" />
          </div>
        </form>

      </div>
    );
  }

});

module.exports = Map;

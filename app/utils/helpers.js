
var getAllBreadCrumbs = function(username, cb) {
  console.log(username);
  $.ajax({
    url: '/api/maps/' + username,
    type: 'GET',
    success: function(data) {
      // this.setState({data: data});
      console.log(data);
      return cb(data);
    },
    error: function(xhr, status, err) {
      console.log(status, err.toString());
    }
  });
};


// Sends a story List to the client
var sendStory = function(username, storyList, cb){

  console.log('HELPER',storyList);
  // $.ajax({
  //     url: 'to/be/decided',
  //     dataType: 'json',
  //     type:'PUT',
  //     data: storyList,
  //     success: function(response){

  //     },
  //     error: function(xhr, status, err) {
  //       console.log(status, err.toString());
  //     }
  // })
}

var addPin = function(username, pin, cb){
  alert("I am now Persisting the Data");
  console.log(pin);
};



var addBreadCrumb = function(username, breadcrumb, cb) {
  console.log(username);
  $.ajax({
    url: '/api/maps/' + username,
    dataType: 'json',
    type: 'PUT',
    data: breadcrumb,
    success: function(data) {
      // this.setState({data: data});
      console.log(data);
      return cb(data);
    },
    error: function(xhr, status, err) {
      console.log(status, err.toString());
    }
  });
};

var signupUser = function(username, password, cb){
  console.log(username,password);
  var user = {
    username: username,
    password: password
  };
  $.ajax({
    url: '/api/users',
    type: 'POST',
    data: user,
    dataType: 'json',
    success: function(data){
      window.location.href = "#map";
      if(cb){
        cb(data);
      }
    },
    error: function(xhr, status, err) {
      console.log("err");
      console.log(xhr.toString(), status.toString(), err.toString());
      // console.log(status, err.toString());
    }

  });
};

var login = function(username, password, cb){
  console.log(username,password);
  var user = {
    username: username,
    password: password
  };
  $.ajax({
    url: '/api/users', //This needs to be a different route for login. not yet implemented
    type: 'POST',
    data: user,
    dataType: 'json',
    success: function(data){
      window.location.href = "#map";
      if(cb){
        cb(data);
      }
    },
    error: function(xhr, status, err) {
      console.log("err");
      console.log(xhr.toString(), status.toString(), err.toString());
      // console.log(status, err.toString());
    }

  });
};

var helpers = {
  getAllBreadCrumbs: getAllBreadCrumbs,
  addBreadCrumb: addBreadCrumb,
  signupUser: signupUser,
  login: login,
  sendStory: sendStory,
  addPin: addPin
}

module.exports = helpers;

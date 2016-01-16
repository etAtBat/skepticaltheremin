//define requirements
var controller = require('../controllers');
if (!process.env.APP_ID) {
  var config = require('../config.js');
}
var request = require('request');
var session = require('express-session');

//////////////////////////////PLACEHOLDER FOR HELPER FUNCTION INTENDED TO HELP CLEAN UP REPEATED CODE BELOW/////////////////////


//the function below leverages the db controllers in order to process the different http requests from the client side;
//it is exported and called from the server.js file
module.exports = function(app){

///////////////////////////////////////////////////USER-RELATED REQUEST HANDLERS////////////////////////////////////////////////
 
  ////////LOGIN-RELATED HANDLERS////////////

  //define facebook parameters to be used for oauth;
  var facebook_APP_ID = process.env.APP_ID || config.facebook.APP_ID;
  var facebook_CALLBACK_URI = process.env.CALLBACK_URI || config.facebook.CALLBACK_URI;
  var facebook_APP_SECRET = process.env.APP_SECRET || config.facebook.APP_SECRET;

  //signin
  app.get('/', function (req, res) {
   //checking if a user already has a session 
   if (!req.session.user) {
     //if they do not, redirect them to the login page
     console.log('nothing for you!')
     res.redirect('login.html');
   }
   //otherwise direct them to the home page;
   res.redirect('index.html');
  });

  //oauth p1 (sending users to facebook for authentication)
  app.get('/auth/facebook', function (req, res) { 
   res.redirect('https://www.facebook.com/dialog/oauth?client_id=' + facebook_APP_ID  + '&redirect_uri=' + facebook_CALLBACK_URI);
  });

  //oauth p2 (facebook redirecting users back to our app after they've been authenticated)
  app.get('/facebook/callback/', function (req, res) {
   //this is a code provided by facebook verifying that user has a fb account and is logged in
   var code = req._parsedUrl.search.substring(6, req._parsedUrl.search.length);
   //define endpoint where app asks fb for user token
   var newEndpoint = 'https://graph.facebook.com/v2.3/oauth/access_token?client_id='+facebook_APP_ID+'&redirect_uri='+facebook_CALLBACK_URI+'&client_secret='+facebook_APP_SECRET+'&code='+code;
   
   //request token from fb @ endpoint
   request(newEndpoint, function (error, response, body) {
     //data coming from fb request
     var jsonBody = JSON.parse(body);
     //data body contains a token
     var myToken = jsonBody.access_token;
     //create route by which we can get userInfo from fb using token
     var toFindUser = 'https://graph.facebook.com/me?fields=name&access_token=' + myToken;
     //use token to get user's fb info
     request(toFindUser, function (error, response, body) {
       var userObj = JSON.parse(body);
       var name = userObj.name;
       //create session for user
       req.session.user = name;
       //once we have info and have created session, redirect user to app homepage;
       res.redirect('/');
     })
   })
  });

  //logout
  app.get('/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/');
    });
  });
 

  ////////ADD/REMOVE USER HANDLERS//////////   
  //add user**
  //NOTE: will need to handle case where username is already in database
  app.post('/api/users', function (req, res) {
    console.log("trying to add new user");
    //define value to be added to the database
    var username = [req.body.username];
  
    //call addUser method in user controller
    controller.user.createUser(username, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(201);
      console.log(username, " successfully added to the db");
    });
  });

  //remove user 
  app.delete('/api/users', function (req, res) {
    console.log("trying to delete existing user");
    //define value to be removed from database 
    var username = [req.body.username];
    //call removeUser method in user controller
    controller.user.removeUser(username, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.status(200).send('goodbye ' + username + " we will miss you");
      console.log(username, " succesfully deleted from db");
    });
  }); 

  ////////ADD/REMOVE FRIEND HANDLERS///////////

  //add friend

  //remove friend


///////////////////////////////////////////////////STORY-RELATED REQUEST HANDLERS////////////////////////////////////////////////

  //create story**
  app.post('/api/story', function (req, res) {
    console.log("trying to create a story");
    var storyData = [req.body.userid, req.body.category, req.body.storyName];
    controller.story.createStory(storyData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(201);
      console.log("successfully enabling user to create a story");
    });
  }); 


  //update story**
  // app.put('/api/story/:id', function (req, res) {
  //   console.log("trying to update a story");
  //   var pinData = req.body.map(function(pinObject){
  //     return [Number(req.params.id), pinObject.categoryid, pinObject.location, pinObject.latitude, pinObject.longitude, pinObject.comment, pinObject.time];
  //   });
  //   controller.story.updateStory(pinData, function(err, data){
  //      if (err) {
  //       return console.error(err);
  //     }
  //     res.sendStatus(200);
  //     console.log("succesfully enabling user to edit story");
  //   });
  // }); 

  //view a story (personal or a friend's)
  app.get('/api/story/:storyid', function (req, res) {
    console.log("trying to view ONE story");
    var storyID = [Number(req.params.storyid)];
    controller.pin.viewStory(storyID, function(err, data){
       if (err) {
        return console.error(err);
      }
      //turns data into json;
      res.json(data.rows);
      console.log("successfully enabling user to view ONE story");
    });
  }); 


  //view all stories (personal or friend's)
  app.get('/api/story/allstories/:userid', function (req, res) {
    console.log("trying to view ALL stories");
    var userID = [Number(req.params.userid)];
    controller.pin.viewStories(userID, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.json(data);
      console.log("successfully enabling user to view ALL stories");
    });
  });


  //remove story
  // app.delete('/api/story/:storyid', function (req, res) {
  //   console.log("trying to delete an existing story");
  //   var storyID = [Number(req.params.storyid)];
  //   controller.user.removeStory(username, function(err, data){
  //      if (err) {
  //       return console.error(err);
  //     }
  //     res.end();
  //     console.log("successfully deleted story from db");
  //   });
  // });

///////////////////////////////////////////////////PIN-RELATED REQUEST HANDLERS////////////////////////////////////////////////

  //add pin
  app.post('/api/pin/:storyid', function (req, res) {
    console.log("adding a pin");
    var pinData = [req.body.userid, Number(req.params.storyid), req.body.location, req.body.latitude, req.body.longitude, req.body.comment, req.body.time];
    controller.pin.createPin(pinData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(201);
      console.log("successfully added a pin");
    });
  });

  //edit pin
  // app.put('/api/pin/:storyid', function (req, res) {
  //   console.log("adding a pin");
  //   var pinData = [req.body.userid, Number(req.params.storyid), req.body.location, req.body.latitude, req.body.longitude, req.body.comment, req.body.time];
  //   controller.pin.createPin(pinData, function(err, data){
  //      if (err) {
  //       return console.error(err);
  //     }
  //     res.sendStatus(201);
  //     console.log("successfully added a pin");
  //   });
  // });


  //remove pin
  app.delete('/api/pin/:id', function (req, res) {
    console.log("deleting a pin");
    var pinData = [req.body.username, req.body.category, req.body.storyName];
    controller.story.viewStories(storyData, function(err, data){
       if (err) {
        return console.error(err);
      }
      res.sendStatus(200);
      console.log("successfully deleted pin");
    });
  });


  };



/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	'new': function (req, res) {
		res.view();		
	},

  'search' : function(req, res){
    res.view();
  },


  search : function(req, res){

var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/sails';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // Get the documents collection
    var collection = db.collection('user');

    
    collection.find({name: 'Jim Bean'}).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        console.log('Found:', result);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
      //Close connection

      db.close();
      res.view();
    });
  }
});
  },

	create: function (req, res, next){
		//create a user with the parameters sent from
		//the sign up form new.ejs

		User.create( req.params.all(), function userCreated (err, user) {

			//if there's an error
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err
				}

				return res.redirect('/user/new');
			}
			//after successfully creating user
			//redirect to the show action

      req.session.authenticated = true;
      req.session.User = user;

			//res.json(user);
			res.redirect('/user/show/'+user.id);
		});
	},
	// render the profile view (e.g. /views/show.ejs)
 show: function (req, res, next) {
     User.findOne(req.param('id'), function foundUser (err, user) {
       if (err) return next(err);
       if (!user) return next();
       res.view({
         user: user
       });
     });
     },
 
 index: function (req, res, next) {
 
     // Get an array of all users in the User collection(e.g. table)
     User.find(function foundUsers (err, users) {
      if (err) return next(err);
       // pass the array down to the /views/index.ejs page
       res.view({
         users: users
       });
     });
   },
 
   // render the edit view (e.g. /views/edit.ejs)
   edit: function (req, res, next) {
 
     // Find the user from the id passed in via params
     User.findOne(req.param('id'), function foundUser (err, user) {
       if (err) return next(err);
       if (!user) return next('User doesn\'t exist.' );
       
       res.view({
         user: user
       });
     });
   },
 
   // process the info from edit view
   update: function (req, res, next) {
     User.update(req.param('id'), req.params.all(), function userUpdated (err) {
       if (err) {
         return res.redirect('/user/edit/' + req.param('id'));
       }
 
       res.redirect('/user/show/' + req.param('id'));
     });
   },

  destroy: function (req, res, next) {

    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);

      });

      res.redirect('/user');  
      
    });
 }

};


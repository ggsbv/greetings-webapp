"use strict";

const whichLanguage = require("./whichLanguage");
const addName = require("./addName");
const fieldExists = require("./fieldExists");

//var MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var format = require("util").format;
var express = require("express");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

var app = express();

mongoose.connect("mongodb://localhost/greetings");
var GreetedNames = mongoose.model("GreetedNames", {name: String, counter : Number});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  console.log("Connected to MongoDB");
  // we're connected!
});

//configure listening port and environment variable
app.set('port', (process.env.PORT || 5000));

//configure template engine
app.engine("handlebars", expressHandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//configure body-parser middleware here
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//Home page, which where the user can enter a name input, and press the submit
//button which returns a greeting.
app.get("/", function(req, res){
  res.render("home");
});

//Greetings page, which is the home page.
app.get("/greetings", function(req, res){
  res.render("home");
});

//history page that shows a list of names that have been greeted.
//list is populated from the names stored in the Mongo DB.
app.get("/history", function(req, res){
  //get all names that only appear once from the Mongo DB.
  GreetedNames.distinct('name', function(err, names){

    console.log("Names datatype: " +  names);

    //prepare the data for injection
    var data = {greetedName : names};
    //add the data to the template and render
    res.render("history", data);
  });
});

//history/:name route
app.get("/history/:name", function(req, res){
  var inputName = req.params.name;
  var timesGreeted = 0;
  //use coll.find method to return a cursor to all documents in the collection
  GreetedNames.find(function(err, results){
    //loop through each object in the results
    for(var i = 0; i < results.length; i++){
      let currentObj = results[i];
      let currentName = currentObj.name;
      console.log("currentName: " + currentObj.name + " inputName: " + inputName);
      //if the currentObj.name = inputName, then timesGreeted = counter field in
      //that object.
      if(currentName === inputName){
        timesGreeted = currentObj.counter;
      };
    };
    res.render('greet', {name : inputName, times : timesGreeted})
  });
});

//the form where user inputs their name as text
app.post('/greet', function(req, res){
  var inputName = req.body.inputName;
  var selected = req.body.languageSelect;
  var data = "";

  if(selected !== undefined && inputName !== ""){
    var greeting = whichLanguage(selected, inputName);
    //use coll.findOne method search the collection for documents that have
    //a name field that matches the inputName
    GreetedNames.findOne({name: inputName}, function(err, result){
      if(err){
        console.log("there was an error");
      };
      //if a name does not exist in the database
      if(!result){
        //create new GreetedName with counter = 1
        var newName = new GreetedNames({name: inputName, counter: 1});
        //save the new doc to the database
        newName.save(function(err){
          if(err){
            console.log(err);
          } else{
            console.log("Name has been saved to the GreetedNames collection.");
          };
        });
      //if the input name does exist in the database:
      } else {
        //increment the counter by calling the coll.update method
        GreetedNames.update(
          //update the entry where the "name" field matches the input name
          {name: inputName},
          //increment the counter field corresponding to the name above
          {
            $inc: {counter: 1}
          },
          function(err, results){
            if(err){
              console.log("Error updating the counter");
            } else {
              console.log("Counter was successfully updated.")
            };
          }
        );
      };
    });
    data = {greetingOut : greeting};
    res.render("home", data);
    //if name is an empty string or no radio button was checked, display the
    //appropriate message so that the user knows what went wrong
  } else {
    let greeting = "";
    if(inputName === ""){
      greeting = "Please input a valid name.";
    } else {
      greeting = "Please select a language.";
    };
    data = {greetingOut : greeting};
    res.render("home", data);
  }
});

//counter page that displays amount of unique users that have been greeted
app.get("/counter", function(req, res){
  GreetedNames.distinct("name", function(err, names){
    var data = "";

    if(names.length === undefined){
      data = {times: 0};
    } else {
      data = {times: names.length};
    };

    res.render("counter", data);
  });
});

//route /counter/reset_counter removes all the names from the Mongo DB, or rather,
//deletes our history of names greeted.
app.post("/counter/reset_counter", function(req, res){
  //call coll.remove method and pass {} as argument which deletes all documents
  //in the collection
  GreetedNames.remove({}, function(err, result){
    if(err){
      console.log("Error removing names from DB.");
    } else {
      console.log("All entries have been removed from the DB.");
    };
  });

  res.render("counter", {times: 0});
});

app.listen(app.get('port'), function(){
  console.log("The frontend server is running on port 5000!")
});

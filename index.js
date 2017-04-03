"use strict";

const whichLanguage = require("./whichLanguage");
const addName = require("./addName");

var express = require("express");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

var app = express();

var usersGreeted = {};
// var historyDiv = document.querySelector("#history");

app.engine("handlebars", expressHandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//configure body-parser middleware here
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.get("/", function(req, res){
  res.render("home");
});

app.get("/greetings", function(req, res){
  // historyDiv.classList.remove(".hidden");
  res.render("home");
});

app.get("/counter", function(req, res){
  // historyDiv.classList.toggle(".hidden");
  var individualsGreeted = [];
  for(var name in usersGreeted){
    individualsGreeted.push(name);
  };
  var data = {greetedName : individualsGreeted};
  res.render("counter", data);
});

app.get("/counter/:name", function(req, res){
  var name = req.params.name;
  res.render('greet', {name, times : usersGreeted[name]})
});

app.post('/greet', function(req, res){
  var inputName = req.body.inputName;
  var selected = req.body.languageSelect;
  if(selected !== undefined && inputName !== ""){
    var greeting = whichLanguage(selected, inputName);
    addName(usersGreeted, inputName);
  } else {
    if(inputName === ""){
      var greeting = "Please input a valid name.";
    } else {
      var greeting = "Please select a language.";
    }
  };

  var data = {greetingOut : greeting};
  //var data = {greetingOut : "Hello, " + inputName};
  // if(usersGreeted[inputName]){
  //   usersGreeted[inputName]++;
  // } else {
  //   usersGreeted[inputName] = 1;
  // };
  res.render("home", data);
});

app.listen(3000, function(){
  console.log("The frontend server is running on port 3000!")
});

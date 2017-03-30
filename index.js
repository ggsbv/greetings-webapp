"use strict";

var express = require("express");
var expressHandlebars = require("express-handlebars");

var app = express();

var usersGreeted = {};

app.engine("handlebars", expressHandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.get("/", function(req, res){
  res.render("home");
});

app.get("/greetings/:name", function(req, res){
  var inputName = req.params.name;
  var data = {greetingOut : "Hello, " + inputName};
  if(usersGreeted[inputName]){
    usersGreeted[inputName]++;
  } else {
    usersGreeted[inputName] = 1;
  };

  res.render("home", data);
});

app.get("/counter", function(req, res){
  /*
  const total = usersGreeted.length;
  const data = {totalUsersGreeted: total + " users have been greeted."};
  const currentLayout = {layout: "counter"};
  res.render("home", data);
  */
  var individualsGreeted = [];
  for(var name in usersGreeted){
    individualsGreeted.push(name);
  };
  var data = {greetedName : individualsGreeted};
  console.log(usersGreeted);
  console.log(individualsGreeted);
  res.render("home", data);
});

app.get("/counter/:name", function(req, res){
  var name = req.params.name;
  res.send(name + " was greeted " + usersGreeted[name] + " times.");
});

app.listen(3000, function(){
  console.log("The frontend server is running on port 3000!")
});

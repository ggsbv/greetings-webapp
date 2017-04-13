module.exports = function(nameList, name, counter){
  if(nameList[name]){
    console.log(name + " was incremented because it already exists in totalUsersGreeted");
    nameList[name]++;
    return "Do not increment.";
  } else {
    console.log("greetingCounter was incremented because the name does not yet exist in totalUsersGreeted");
    nameList[name] = 1;
    counter++;
    return "Increment.";
  };
};

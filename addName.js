module.exports = function(nameList, name){
  if(nameList[name]){
    nameList[name]++;
  } else {
    nameList[name] = 1;
  };
  return "Name has been added to the list."
};

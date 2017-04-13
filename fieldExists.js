module.exports = function(coll, inputName){
  coll.find(function(err, objectList){
    for(var i = 0; i < objectList.length; i++){
      if(objectList.name === inputName){
        return true;
      };
    };
    return false;
  });
};

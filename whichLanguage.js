module.exports = function(languageValue, name){
  console.log(languageValue);
  switch (languageValue) {
    case 'fr':
      return "Bonjour, " + name;
      break;
    case 'es':
      return "Hola, " + name;
    case 'en':
    return "Hello, " + name;
    default:
      return "Error"
  };
};

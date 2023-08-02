const useFunctions = () => {
  const properCase = (str, options) => {
    let returnStr = "";
    const strArray = str.split(" ");
    let firstLetter;
    let remainingLetterOnWord;
    
    if (options?.firstWordOnly) {
      firstLetter = strArray[0].charAt(0);
      remainingLetterOnWord = strArray[0].slice(1);
        const properFirstWord = firstLetter.toUpperCase() + remainingLetterOnWord.toLowerCase();

        returnStr += properFirstWord;
      
        const strArrayMinusFirstWord = strArray.filter((str) => !(str.toLowerCase()===strArray[0].toLowerCase()))
        strArrayMinusFirstWord.forEach((str) => {
            returnStr += str.toLowerCase();
        })
    }
    else {
        strArray.forEach((str) => {
            firstLetter = str.charAt(0);
            remainingLetterOnWord = str.slice(1);
            returnStr += firstLetter.toUpperCase() + remainingLetterOnWord.toLowerCase() + ` `
        })
        returnStr = returnStr.slice(0, -1)
    }

    return returnStr;

  };

  return {
    properCase,
  };
};

export default useFunctions;

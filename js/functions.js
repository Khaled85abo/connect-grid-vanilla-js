function create3TokenConnectedVerticallyObj(validationObj, gridsToConnect) {
  const obj = {};
  for (let [key, value] of Object.entries(validationObj)) {
    // saving the last 3 tokens from col that has multi tokens
    if (value.length > gridsToConnect - 2) {
      const lastThree = value.slice(value.length - 3, value.length);
      obj[key] = lastThree;
    }
  }

  // Do the last 3 token belongs to the same player?

  let threeTokensconnectedVertically = {};
  for (let [key, value] of Object.entries(obj)) {
    let firstToken = value[0].token;
    let match = true;
    for (let i = 1; i < value.length; i++) {
      if (firstToken !== value[i].token) {
        match = false;
      }
      firstToken = value[i].token;
    }
    if (!match) {
      threeTokensconnectedVertically[key] = match;
    } else {
      // add token to prevent
      threeTokensconnectedVertically[key] = value[0].token;
    }
  }

  return threeTokensconnectedVertically;
}

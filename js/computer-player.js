export default function analizeAndPlay(
  validationObj,
  columns,
  gridsToConnect,
  tokenCounter
) {
  let actionTaken = false;
  // console.log("computer turn, token count: ", state.tokensCounter);
  if (tokensCounter == 0) {
    addToken(Math.floor(columns / 2));
    actionTaken = true;
  } else if (tokensCounter == 1) {
    let firstTokenPos;
    for (let [keyInt, value] of Object.entries(validationObj)) {
      const key = Number(keyInt);
      if (value.length > 0) {
        firstTokenPos = key;
      }
    }
    if (firstTokenPos > Math.ceil(coumns / 2)) {
      addToken(firstTokenPos - 1);
      actionTaken = true;
    } else {
      addToken(firstTokenPos + 1);
      actionTaken = true;
    }
  } else {
    // Create Arrays to check whom has advantage.
    // first set of arrays will be for the oponent tokens
    // if there is a set that has less than one token to compelete then the prioity is to prevent the user from completing his/her set
    // else if there is a set with computer tokens that has one token to complete then the priority is to complete the set.
    // second set of arrays will be for own tokens

    actionTaken = analize3TokensSequence();
    // actionTaken = analize2TokensSequence();
  }
  if (!actionTaken) {
    addRandomToken();
  }
}

function analize3TokensSequence() {
  let actionTaken = false;
  if (state.v_verification) {
    actionTaken = check3TokensSequenceVartically();
  }
  if (state.h_verification) {
    actionTaken = check3TokensSequenceHorizontally();
  }

  return actionTaken;
}

function check3TokensSequenceVartically(validationObj, gridsToConnect) {
  let actionTaken = false;
  // const threeTokensconnectedVertically = create3TokenConnectedVerticallyObj(state.validationObj, state.gridsToConnect)
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

  for (let [key, value] of Object.entries(threeTokensconnectedVertically)) {
    if (value !== false) {
      if (value === 0) {
        // add token to win in column with the index
        if (checkAddiablity(key)) {
          addToken(key);
          actionTaken = true;
        }
      } else if (value === 1) {
        // add token to prevent user from wining in column with the index
        if (checkAddiablity(key)) {
          addToken(key);
          actionTaken = true;
        }
      }
    }
  }

  return actionTaken;
}

function check3TokensSequenceHorizontally(
  validationObj,
  gridsToConnect,
  columns
) {
  let actionTaken = false;
  // Analize Horizontally
  // create all possible horizontal arrays
  const hoizontalArrays = {};

  for (let j = 0; j < columns; j++) {
    const value = validationObj[j];
    const outputObj = {};
    for (let v = 0; v <= value.length; v++) {
      let h_array = [];
      for (let i = 0; i < gridsToConnect; i++) {
        if (i + j < columns) {
          if (validationObj[j + i][v]) {
            h_array.push(validationObj[j + i][v].token);
          } else {
            h_array.push("empty");
          }
        }
      }
      if (h_array.length === gridsToConnect) {
        outputObj[v] = h_array;
      }
    }
    hoizontalArrays[j] = outputObj;
  }

  const filteredArrays = {};
  // filtering all arrays that has a complete sett of tokens and those who has only empty spaces
  for (let [colKey, innerObj] of Object.entries(hoizontalArrays)) {
    const arrays = {};
    innerObj;
    for (let [key, value] of Object.entries(innerObj)) {
      let filArr = value.filter((el) => el !== "empty");
      filArr;
      if (value.includes("empty") && filArr.length > 0) {
        arrays[key] = value;
      }
    }
    arrays;
    filteredArrays[colKey] = arrays;
  }

  // find  arrays with one empty space and 3 similar tokens
  const filteredArraysWith3Tokens = {};
  for (let [colKey, innerObj] of Object.entries(filteredArrays)) {
    let arrays = {};
    innerObj;
    for (let [key, value] of Object.entries(innerObj)) {
      let match = true;
      let filArr = value.filter((el) => el !== "empty");
      let firstEl = filArr[0];
      firstEl;
      for (let el of filArr) {
        if (firstEl !== el) {
          match = false;
        }
      }
      if (match && filArr.length >= gridsToConnect - 1) {
        arrays[key] = value;
      }
    }
    arrays;

    filteredArraysWith3Tokens[colKey] = arrays;
  }
  filteredArraysWith3Tokens;

  // take action
  for (let [colKeyInt, innerObj] of Object.entries(filteredArraysWith3Tokens)) {
    const colKey = Number(colKeyInt);
    if (Object.keys(innerObj).length > 0) {
      for (let [keyInt, value] of Object.entries(innerObj)) {
        const index = value.indexOf("empty");
        const key = Number(keyInt);
        const targetedCol = colKey + index;
        if (key === 0) {
          // take action directly
          if (value.includes(0)) {
            // add token to win
            addToken(targetedCol);
            actionTaken = true;
          } else {
            // add token to prevent
            addToken(targetedCol);
            actionTaken = true;
          }
        } else if (key > 0) {
          // check if adding token is possible
          if (validationObj[targetedCol][key - 1]) {
            if (value.includes(0)) {
              // add token to win
              addToken(targetedCol);
              actionTaken = true;
            } else {
              // add token to prevent
              addToken(targetedCol);
              actionTaken = true;
            }
          }
        }
      }
    }
  }

  return actionTaken;
}

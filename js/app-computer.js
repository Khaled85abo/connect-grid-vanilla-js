// validation : which player played first, where does the token exist, where to replace the first token,
// analize the existing foe tokens and predict the wanted pattern, analize owns token and create a wanted pattern
// sepaerate actions to two parts, actions to prevent or action to complete.
// if the foes pattern is away from being a threat or if the AI player is the first to play, then action is commplete
// if the foe player is the frist to play or the foe pattern is a threat then action is to prevent.

// Analize -> Validate -> determine action -> execute

// first player  turn: true, token: 1  USER
// second player turn: false, token: 0 COMPUTER
// state.computerMode = true // Computer mode is true
const CONSTANTS = {
  COMPUTER_TOKEN = 0,
  USER_TOKEN = 1
}
state = {};
function initState() {
  state.computerMode = false // 
  state.turn = Math.random() > .5 ? true : false // true for user, false for computer
}

function initState() {
  state.computerMode = false 
  state.turn = Math.random() > 0.5 ? true : false;
  state.columns = 8;
  state.gridsToConnect = 4;
  state.tokensCounter = 0;
  state.infoShown = false;
  state.clickType = CONSTANTS.DBLCLICK;
  state.maxTokens;
  state.validationObj = {};
  state.h_verification = true;
  state.v_verification = true;
  state.d_verification = true;
  state.snackBarTime = 3;
}



function addToken(columnKey) {
  const columnDOM = document.querySelector(`[data-column-id='${columnKey}']`);
  const token = state.turn ? 1 : 0;
  const tokenDiv = `<div data-token-id=${state.tokensCounter} class='token ${
    state.turn ? "red" : "blue"
  }'></div>`;

  // Is there a place for an extra token in that column.
  if (checkAddiablity(columnDOM)) {
    columnDOM.insertAdjacentHTML("beforeend", tokenDiv);
    // token._renderToken(e.target.dataset.columnId)
    state.validationObj[columnKey].push({
      token,
      tokenId: state.tokensCounter,
    });
    if (state.tokensCounter === 0) {
      columnDOM.scrollIntoView({ block: "end", behavior: "smooth" });
    }
    checkResult(columnKey);
    changePlayer();
  }
  console.log(state.validationObj);
}



function whoToPlay() {
    // if (turn) {
    //   state.columns.addEventListener(state.clickType, addToken);
    // } else {
    //   state.columns.removeEventListener(state.clickType, addToken);
    //   analize();
    // }
  if (!turn) {
    analize()
  }
}

function changePlayer() {
  state.turn = !state.turn;
  state.tokensCounter++;
  showPlayer();
  if (state.computerMode && !turn) {
    analize()
  }
}

function analize() {
  let actionTaken = false
  if (tokensCount === 0) {
    addToken(Math.floor(state.columns / 2));
    actionTaken = true
  } else if (tokensCount === 1) {
    let firstTokenPos;
    for (let col of validationObj) {
      if (col.length > 0) {
        firstTokenPos = col;
      }
    }
    if (firstTokenPos > Math.ceil(state.coumns / 2)) {
      addToken(firstTokenPos - 1);
      actionTaken = true
    } else {
      addToken(firstTokenPos + 1);
      actionTaken = true
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
    addRandomToken()
  }
}


function addTokenRandomly() {
    const targetCol = Math.floor(Math.random() * state.columns)
    addToken(targetCol)
}

function analize3TokensSequence() {
  let actionTaken = false
  if (state.v_verification) {
    actionTaken = check3TokensSequenceVartically();
  }
  if (state.h_verification) {
    actionTaken = check3TokensSequenceHorizontally();
  }
  // if (state.d_verification) {
  //   actionTaken = check3TokensSequenceDiagonally45();
  //   actionTaken = check3TokensSequenceDiagonally135()
  // }
    return actionTaken
}

function analize2TokensSequence() {
  let actionTaken = false
  if (state.v_verification) {
      actionTaken = check2TokensSequenceVartically();
  }
  if (state.h_verification) {
      actionTaken = check2TokensSequenceHorizontally();
  }
  if (state.d_verification) {
      actionTaken = check2TokensSequenceDiagonally45();
      actionTaken = check2TokensSequenceDiagonally135();
  }
    return actionTaken
}


function check3TokensSequenceVartically() {
  let actionTaken = false;

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
        addToken(key)
        actionTaken = true
      } else if (value === 1) {
        // add token to prevent user from wining in column with the index
        addToken(key)
        actionTaken = true
      }
    }
  }

  return actionTaken
}


function check3TokensSequenceHorizontally() {
  let actionTaken = false
  // Analize Horizontally
  // create all possible horizontal arrays
const hoizontalArrays = {};

for (let j = 0; j < state.columns; j++) {
  const value = validationObj[j];
  const outputObj = {}
    for (let v = 0; v <= value.length; v++) {
        let h_array = [];
        for (i = 0; i < gridsToConnect; i++){
            
            if (i + j < state.columns) {
                if (validationObj[j + i][v]) {
                    
                    h_array.push(validationObj[j + i][v].token); 
                } else {
                    h_array.push('empty')
                }
            }
        }
        if (h_array.length === gridsToConnect ) {
            outputObj[v] = h_array
        }
    }
    hoizontalArrays[j] = outputObj
  }
  
  const filteredArrays = {}
// filtering all arrays that has a complete sett of tokens and those who has only empty spaces
for (let [colKey, innerObj] of Object.entries(hoizontalArrays)) {
    const arrays = {}
    innerObj
    for (let [key, value] of Object.entries(innerObj)) {
        let filArr = value.filter(el => el !== 'empty')
        filArr
        if (value.includes('empty') && filArr.length > 0) {
           arrays[key] = value
       }
    }
    arrays
    filteredArrays[colKey] = arrays
}


// find  arrays with one empty space and 3 similar tokens
const filteredArraysWith3Tokens = {}
for (let [colKey, innerObj] of Object.entries(filteredArrays)) {
    let arrays = {}
    innerObj
    for (let [key, value] of Object.entries(innerObj)) {
        let match = true
        let filArr = value.filter(el => el !== 'empty')
        let firstEl = filArr[0]
        firstEl
        for (let el of filArr) {
            if (firstEl !== el) {
                match = false
            }
        }
        if (match && filArr.length >= gridsToConnect - 1) {
            arrays[key] = value
        }
    }
    arrays

    filteredArraysWith3Tokens[colKey] = arrays
}
filteredArraysWith3Tokens


// take action
for (let [colKeyInt, innerObj] of Object.entries(filteredArraysWith3Tokens)) {
    const colKey = Number(colKeyInt)
    if (Object.keys(innerObj).length > 0) {
        for (let [keyInt, value] of Object.entries(innerObj)) {
            const index = value.indexOf("empty");
            const key = Number(keyInt)
            const targetedCol = colKey + index;
            if (key === 0) {
                // take action directly
                if (value.includes(0)) {
                    // add token to win
                  addToken(targetedCol)
                  actionTaken = true
                } else {
                    // add token to prevent
                  addToken(targetedCol)
                                    actionTaken = true

                }
            } else if (key > 0) {
                // check if adding token is possible
                if (validationObj[targetedCol][key - 1]) {
                     if (value.includes(0)) {
                       // add token to win
                       addToken(targetedCol);
                       actionTaken = true

                     } else {
                       // add token to prevent
                       addToken(targetedCol);
                       actionTaken = true

                     }
                }
            }
        }
    }
}

return actionTaken
}

// function check3TokensSequenceDiagonally45() {
// }
// function check3TokensSequenceDiagonally135() {
// }

function check2TokensSequenceVartically() {
  const obj = {};
for (let [key, value] of Object.entries(validationObj)) {
  // saving the last 3 tokens from col that has multi tokens
  if (value.length > gridsToConnect - 2) {
    const lastThree = value.slice(value.length - 3, value.length);
    obj[key] = lastThree;
  }
  }
  
  // last two token belong to the same player
let twoTokensconnectedVertically = {};
for (let [key, value] of Object.entries(obj)) {
  if (value[1].token !== value[2].token) {
    twoTokensconnectedVertically[key] = false;
  } else {
    twoTokensconnectedVertically[key] = value[0].token;
  }
}
twoTokensconnectedVertically;
// Taking action at 2 tokens connected
for (let [key, value] of Object.entries(twoTokensconnectedVertically)) {
  if (value !== false) {
    if (value === 0) {
      // add token to  in column with the index
    } else if (value === 1) {
      // add token in column with the index
    }
  }
}
}
function check2TokensSequenceHorizontally() {
  let actionTaken = false
  const hoizontalArrays = {};

for (let j = 0; j < state.columns; j++) {
  const value = validationObj[j];
  const outputObj = {}
    for (let v = 0; v <= value.length; v++) {
        let h_array = [];
        for (i = 0; i < gridsToConnect; i++){
            
            if (i + j < state.columns) {
                if (validationObj[j + i][v]) {
                    
                    h_array.push(validationObj[j + i][v].token); 
                } else {
                    h_array.push('empty')
                }
            }
        }
        if (h_array.length === gridsToConnect ) {
            outputObj[v] = h_array
        }
    }
    hoizontalArrays[j] = outputObj
  }
  
  const filteredArrays = {}
// filtering all arrays that has a complete sett of tokens and those who has only empty spaces
for (let [colKey, innerObj] of Object.entries(hoizontalArrays)) {
    const arrays = {}
    innerObj
    for (let [key, value] of Object.entries(innerObj)) {
        let filArr = value.filter(el => el !== 'empty')
        filArr
        if (value.includes('empty') && filArr.length > 0) {
           arrays[key] = value
       }
    }
    arrays
    filteredArrays[colKey] = arrays
}

  const filteredArraysWith2Tokens = {}
for (let [colKey, innerObj] of Object.entries(filteredArrays)) {
    let array = {}
    for (let [key, value] of Object.entries(innerObj)) {
        let match = true
        let filArr = value.filter(el => el !== 'empty')
        let firstEl = filArr[0]
        for (let el of filArr) {
            if (firstEl !== el) {
                match= false
            }
        }
        if (match && filArr.length >= gridsToConnect - 2) {
            array[key] = value
        }
    }
    filteredArraysWith2Tokens[colKey] = array
}
}
// function check2TokensSequenceDiagonally45() {
// }
// function check2TokensSequenceDiagonally135() {
// }


function addRandomToken() {
    const targetCol = Math.floor(Math.random() * columns)
    addToken(targetCol)
}




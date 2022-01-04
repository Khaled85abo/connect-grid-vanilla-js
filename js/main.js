/***
 * IMPORTS
 */
const state = {};

/**
 *
 * ENTRY POINT
 *
 */
///#region
const CONSTANTS = {
  DBLCLICK: "dblclick",
  CLICK: "click",
};
function main() {
  initState();
  showPlayer();
  renderRangeValuesInInputs();
  renderColumns();
  checkScreenWidth();

  initActions();
}
main();
///#endregion
/**
 *
 * MODEL
 *
 */
//#region
function initState() {
  state.computerMode = false;
  state.columns = 8;
  state.gridsToConnect = 4;
  state.turn = Math.random() > 0.5 ? true : false;
  state.tokensCounter = 0;
  state.infoShown = false;
  state.clickType = CONSTANTS.DBLCLICK;
  state.maxTokens;
  state.validationObj = {};
  state.h_verification = true;
  state.v_verification = true;
  state.d_verification = true;
  state.snackBarTime = 3;
  //   state.validationObj = {
  //     0: [{token: 1, tokenId: 0}, {token: 1, tokenId: 5}, {token: 0, tokenId: 4}, {token: 0, tokenId: 14}],
  //     1: [{token: 0, tokenId: 7}, {token: 1, tokenId: 5}, {token: 0, tokenId: 4}, {token: 0, tokenId: 15}],
  //     2: [{token: 0, tokenId: 9}, {token: 0, tokenId: 5}, {token: 0, tokenId: 4}, {token: 0, tokenId: 16}],
  //     3: [{token: 1, tokenId: 8}, {token: 1, tokenId: 5}, {token: 0, tokenId: 4}, {token: 0, tokenId: 13}],
  //   };

  // first player turn: true, token: 1
  // second player turn: false, token: 0
}

// Not used code.
class Token {
  constructor(tokenCounter) {
    this.tokenId = tokenCounter;
  }
  _createToken() {
    return `<div data-token-id='${this.tokenId}' ></div>`;
  }
  _renderToken(tokenCount, columnKey) {
    const token = this._createToken(tokenCount);
    document.querySelector(`[data-column-id=${columnKey}]`).appendChild(token);
  }
  _alignedToken() {}
}

/**
 * Checking results will only validate state validation object.
 * If a match is found, the tokens ids is send to (announceWinner) function to be highlighted.
 * @param {*} columnKey
 */
function checkResult(columnKey) {
  const {
    gridsToConnect,
    v_verification,
    h_verification,
    d_verification,
    validationObj,
  } = state;
  const column = validationObj[columnKey];
  if (v_verification) {
    if (column.length >= gridsToConnect) {
      checkVertically(columnKey);
    }
  }
  if (h_verification) {
    checkHorizantally(columnKey);
  }
  if (d_verification) {
    checkDiagonally(columnKey);
  }
}

function checkVertically(columnKey) {
  const column = state.validationObj[columnKey];
  let lastToken = column[column.length - 1].token;
  const tokensArray = [column[column.length - 1]];
  for (
    let i = column.length - 2;
    i >= column.length - state.gridsToConnect;
    i--
  ) {
    if (lastToken !== column[i].token) {
      return false;
    }
    tokensArray.push(column[i]);
    // lastToken = column[i].token;
  }
  announceWinner(lastToken, tokensArray);
}

function checkHorizantally(columnKey) {
  const column = state.validationObj[columnKey];
  const lastToken = column[column.length - 1].token;
  const theTokenIndex = column.length - 1; // It is always the last token added in a column that is going to be the start token

  // creating arraies where the token occupiees all possibles positions
  // and checking if any array contains the same tokens.
  let validationArraies = [];

  // console.log("token index: ", theTokenIndex);
  for (let i = 0; i < state.gridsToConnect; i++) {
    // extract token from nearby columns with the same token level (index).
    const output = createHorizontalArrays(columnKey - i, theTokenIndex);
    if (output) {
      validationArraies.push(output);
    }
  }
  for (let arr of validationArraies) {
    let match = true;
    let token = arr[0].token;
    for (let el of arr) {
      if (el.token !== token) {
        match = false;
      }
    }
    if (match) {
      announceWinner(token, arr);
    }
  }
}

function createHorizontalArrays(columnIndex, theTokenIndex) {
  let output = [];
  for (let j = columnIndex; j < columnIndex + state.gridsToConnect; j++) {
    if (j >= 0 && j < state.columns) {
      output.push(state.validationObj[j][theTokenIndex]);
    }
  }
  // filtering out all undefined values from output array
  let filteredOutput = output.filter((item) => item !== undefined);
  // Returning only output array that has as many items as gridsToConnect
  if (filteredOutput.length === state.gridsToConnect) {
    return filteredOutput;
  }
}

function checkDiagonally(columnKey) {
  const column = state.validationObj[columnKey];
  const theTokenIndex = column.length - 1; // It is always the last token added in a column that is going to be the start token

  // creating arraies where the token occupiees all possibles positions
  let validationArraies = [];

  // with 135 tilting
  for (let i = 0; i < state.gridsToConnect; i++) {
    const output = createDiagonal135DegArrays(columnKey - i, theTokenIndex + i);
    if (output) {
      validationArraies.push(output);
    }
  }

  // with 45 tilting
  for (let i = 0; i < state.gridsToConnect; i++) {
    const output = createDiagonal45DegArrays(columnKey - i, theTokenIndex - i);
    if (output) {
      validationArraies.push(output);
    }
  }

  // Checking if any array contains the same token.
  for (let arr of validationArraies) {
    let match = true;
    let token = arr[0].token;
    for (let el of arr) {
      if (el.token !== token) {
        match = false;
      }
    }
    if (match) {
      announceWinner(token, arr);
    }
  }
}

function createDiagonal135DegArrays(columnIndex, theTokenIndex) {
  let output = [];

  let startTokenIndex = theTokenIndex;
  for (let j = columnIndex; j < columnIndex + state.gridsToConnect; j++) {
    if (j >= 0 && j < state.columns) {
      output.push(state.validationObj[j][startTokenIndex]);
      startTokenIndex--;
    }
  }
  // filtering out all undefined values from output array
  let filteredOutput = output.filter((item) => item !== undefined);
  // Returning only output array that has as many items as gridsToConnect
  if (filteredOutput.length === state.gridsToConnect) {
    return filteredOutput;
  }
}
function createDiagonal45DegArrays(columnIndex, theTokenIndex) {
  let output = [];

  let startTokenIndex = theTokenIndex;
  for (let j = columnIndex; j < columnIndex + state.gridsToConnect; j++) {
    if (j >= 0 && j < state.columns) {
      output.push(state.validationObj[j][startTokenIndex]);
      startTokenIndex++;
    }
  }
  // filtering out all undefined values from output array
  let filteredOutput = output.filter((item) => item !== undefined);
  // Returning only output array that has as many items as gridsToConnect
  if (filteredOutput.length === state.gridsToConnect) {
    return filteredOutput;
  }
}

function changeAddingTokensClick() {
  state.clickType = document.querySelector("#dblClick").checked
    ? CONSTANTS.DBLCLICK
    : CONSTANTS.CLICK;
  renderColumns();
}

function handle_v_verification(e) {
  if (e.target.checked) {
    state.v_verification = true;
  } else {
    if (!state.h_verification && !state.d_verification) {
      showSnackBar();
      e.target.checked = true;
      return;
    }
    state.v_verification = false;
  }
}
function handle_h_verification(e) {
  if (e.target.checked) {
    state.h_verification = true;
  } else {
    if (!state.v_verification && !state.d_verification) {
      showSnackBar();
      e.target.checked = true;
      return;
    }
    state.h_verification = false;
  }
}
function handle_d_verification(e) {
  if (e.target.checked) {
    state.d_verification = true;
  } else {
    if (!state.h_verification && !state.v_verification) {
      showSnackBar();
      e.target.checked = true;
      return;
    }
    state.d_verification = false;
  }
}
//#endregion

/***
 *
 * CONTROLLERS
 *
 */
//#region

function changePlayer() {
  state.turn = !state.turn;
  showPlayer();
  if (state.computerMode && !state.turn) {
    analizeAndPlay();
  }
}

function analizeAndPlay() {
  let actionTaken = false;
  // console.log("computer turn, token count: ", state.tokensCounter);
  if (state.tokensCounter == 0) {
    addToken(Math.floor(state.columns / 2));
    actionTaken = true;
  } else if (state.tokensCounter == 1) {
    let firstTokenPos;
    for (let [keyInt, value] of Object.entries(state.validationObj)) {
      const key = Number(keyInt);
      if (value.length > 0) {
        firstTokenPos = key;
      }
    }
    if (firstTokenPos > Math.ceil(state.coumns / 2)) {
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

function addRandomToken() {
  console.log("random token deployed");
  const targetCol = Math.floor(Math.random() * state.columns);
  addToken(targetCol);
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

function check3TokensSequenceVartically() {
  let actionTaken = false;
  // const threeTokensconnectedVertically = create3TokenConnectedVerticallyObj(state.validationObj, state.gridsToConnect)
  const obj = {};
  for (let [key, value] of Object.entries(state.validationObj)) {
    // saving the last 3 tokens from col that has multi tokens
    if (value.length > state.gridsToConnect - 2) {
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

function check3TokensSequenceHorizontally() {
  let actionTaken = false;
  // Analize Horizontally
  // create all possible horizontal arrays
  const hoizontalArrays = {};

  for (let j = 0; j < state.columns; j++) {
    const value = state.validationObj[j];
    const outputObj = {};
    for (let v = 0; v <= value.length; v++) {
      let h_array = [];
      for (let i = 0; i < state.gridsToConnect; i++) {
        if (i + j < state.columns) {
          if (state.validationObj[j + i][v]) {
            h_array.push(state.validationObj[j + i][v].token);
          } else {
            h_array.push("empty");
          }
        }
      }
      if (h_array.length === state.gridsToConnect) {
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
      if (match && filArr.length >= state.gridsToConnect - 1) {
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
          if (state.validationObj[targetedCol][key - 1]) {
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

function handleComputerPlayer(e) {
  state.computerMode = e.target.checked;
  handleStartAgain();
  changePlayer();
}

function initActions() {
  document
    .querySelector("#h-verification")
    .addEventListener("change", handle_h_verification);
  document
    .querySelector("#v-verification")
    .addEventListener("change", handle_v_verification);
  document
    .querySelector("#d-verification")
    .addEventListener("change", handle_d_verification);
  document
    .querySelector("#columns")
    .addEventListener("change", handleColumnsRangeChange);
  document
    .querySelector("#tokens")
    .addEventListener("change", handleGridsToConnectRangeChange);

  document
    .querySelector(".start-again")
    .addEventListener("click", handleStartAgain);

  document
    .querySelector(".player-info .cancel")
    .addEventListener("click", handleClosePlayerInfoModal);
  document
    .querySelector(".player-settings .cancel")
    .addEventListener("click", handleClosePlayerSettingsModal);
  document
    .querySelector(".settings-div > img:nth-of-type(1)")
    .addEventListener("click", handleOpenPlayerInfoModal);
  document
    .querySelector(".settings-div > img:nth-of-type(2)")
    .addEventListener("click", handleOpenPlayerSettingsModal);
  document
    .querySelector("#dblClick")
    .addEventListener("change", changeAddingTokensClick);
  document
    .querySelector("#computer-player")
    .addEventListener("change", handleComputerPlayer);
}

function handleColumnsRangeChange() {
  state.columns = Number(document.querySelector("#columns").value);
  renderRangeValuesInSpans();
  renderColumns();
}
function handleGridsToConnectRangeChange() {
  state.gridsToConnect = Number(document.querySelector("#tokens").value);
  renderRangeValuesInSpans();
}

function handleStartAgain() {
  state.tokensCounter = 0;
  state.validationObj = {};
  renderColumns();
  deleteAllTokens();
  handleClosePlayerSettingsModal();
}

/**
 * Changing click type to single click as double click doesn't work in mobile simulator.
 */
function checkScreenWidth() {
  if (window.innerWidth < 700) {
    state.clickType = CONSTANTS.CLICK;
    document.querySelector("#dblClick").checked = false;
  }
}

/**
 *
 * @param {div} div the column in which the token will be added
 * @returns true when there is a place for another token else returns false.
 */
function checkAddiablity(columnKey) {
  console.log("check add ability in column: ", columnKey);
  const columnDOM = document.querySelector(`[data-column-id='${columnKey}']`);
  const tokens = columnDOM.querySelectorAll(".token");

  if (tokens.length === 0) {
    return true;
  }
  if (tokens.length > 0) {
    const tokenHeight = tokens[0].offsetHeight;

    const leftSpace = columnDOM.offsetHeight - tokens.length * tokenHeight;
    if (leftSpace > tokenHeight) {
      return true;
    } else {
      return false;
    }
  }
}

//#endregion

/**
 *
 * VIEW
 *
 */
//#region

function renderRangeValuesInInputs() {
  document.querySelector("#columns").value = state.columns;
  document.querySelector("#tokens").value = state.gridsToConnect;
  renderRangeValuesInSpans();
}

function renderRangeValuesInSpans() {
  // console.log(state.columns, state.gridsToConnect);
  document.querySelector(".columns-span").innerText = state.columns;
  document.querySelector(".tokens-span").innerText = state.gridsToConnect;
}

function showPlayer() {
  document
    .querySelectorAll(".highlight")
    .forEach((el) => el.classList.remove("highlight"));
  if (state.turn) {
    document.querySelector(".first-player > svg ").classList.add("highlight");
  } else {
    document.querySelector(".second-player > svg ").classList.add("highlight");
  }
}

function renderColumns() {
  //Changing click type to single click as double click doesn't work on mobile simulator.
  document.querySelector(".columns-container").innerHTML = "";
  for (let i = 0; i < state.columns; i++) {
    const div = document.createElement("div");
    div.setAttribute("data-column-id", i);
    document.querySelector(".columns-container").appendChild(div);
    state.validationObj[i] = [];
    div.addEventListener(state.clickType, () => addToken(i));
  }
  // console.log(state.validationObj);
}

/**
 *
 * @param {*} columnDOM DOM rendered column
 * @param {*} columnKey the column key in state validation object that include all column's tokens
 */
function addToken(columnKey) {
  const token = state.turn ? 1 : 0;
  const tokenDiv = `<div data-token-id=${state.tokensCounter} class='token ${
    state.turn ? "red" : "blue"
  }'></div>`;

  // const token = new Token(state.tokenCount)

  // Check if there is a place for an extra token.
  const columnDOM = document.querySelector(`[data-column-id='${columnKey}']`);
  if (checkAddiablity(columnKey)) {
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
    state.tokensCounter++;
    changePlayer();
  }
  // console.log(state.validationObj);
}

function handleClosePlayerInfoModal() {
  document.querySelector(".player-info").classList.remove("show-modal");
}
function handleOpenPlayerInfoModal() {
  document.querySelector(".player-info").classList.add("show-modal");
}
function handleOpenPlayerSettingsModal() {
  document.querySelector(".player-settings").classList.add("show-modal");
}
function handleClosePlayerSettingsModal() {
  document.querySelector(".player-settings").classList.remove("show-modal");
}

function announceWinner(token, tokensArray) {
  const winner = token === 1 ? "first player" : "second player";
  // console.log("The winner is the", winner);
  // console.log("array of tokens", tokensArray);
  for (let token of tokensArray) {
    document
      .querySelector(`[data-token-id='${token.tokenId}']`)
      .classList.add("winner");
  }
  // Not working
  const columns = document.querySelectorAll(`[data-column-id]`);
  // console.log(columns);
  // columns.forEach((col) =>
  //   col.removeEventListener(`${state.clickType}`, addToken)
  // );
}

function showSnackBar() {
  const snackBar = document.createElement("div");
  snackBar.innerHTML =
    "<p>At least one validation method should be available!</p>";
  const exit = document.createElement("div");
  exit.innerText = "X";
  snackBar.appendChild(exit);
  snackBar.classList.add("snack-bar");
  document.body.appendChild(snackBar);

  exit.addEventListener("click", () => {
    snackBar.remove();
  });

  setTimeout(() => {
    snackBar.remove();
  }, state.snackBarTime * 1000);
}

function deleteAllTokens() {
  document.querySelectorAll("[data-token-id]").forEach((el) => el.remove());
}

//#endregion

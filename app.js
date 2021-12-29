/**
 *
 * ENTRY POINT
 *
 */
///#region
const state = {};
const CONSTANTS = {
  DBLCLICK: "dblclick",
  CLICK: "click",
};
function main() {
  initState();
  showPlayer();
  renderRangeValuesInInputs();
  renderColumns();
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
  //     1: [{token: 0, tokenId: 0}, {token: 1, tokenId: 5}, {token: 0, tokenId: 4}, {token: 0, tokenId: 15}],
  //     2: [{token: 0, tokenId: 0}, {token: 0, tokenId: 5}, {token: 0, tokenId: 4}, {token: 0, tokenId: 16}],
  //     3: [{token: 1, tokenId: }, {token: 1, tokenId: 5}, {token: 0, tokenId: 4}, {token: 0, tokenId: 13}],
  //   };
}

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

function shiftPlayer() {
  state.turn = !state.turn;
  state.tokensCounter++;
  showPlayer();
}

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

  console.log("token index: ", theTokenIndex);
  for (let i = 0; i < state.gridsToConnect; i++) {
    // extract token from nearby columns with the same token level (index).
    const output = createHorizontalArrays(columnKey - i, theTokenIndex);
    if (output) {
      validationArraies.push(output);
    }
  }
  console.log("validationArraies", validationArraies);
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

  console.log("token index: ", theTokenIndex);
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

  console.log("validationArraies", validationArraies);
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
    .querySelector(".player-settings .reset")
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
  deleteAllToken();
  handleClosePlayerSettingsModal();
}

/**
 *
 * @param {*} div DOM rendered column
 * @param {*} columnKey the column key of state validation object that include all added tokens
 */
function initColumnActions(div, columnKey) {
  //Changing click type to single click as double click doesn't work on mobile simulator.
  checkScreenWidth();
  div.addEventListener(state.clickType, () => {
    const token = state.turn ? 1 : 0;
    const tokenDiv = `<div data-token-id=${state.tokensCounter} class='token ${
      state.turn ? "red" : "blue"
    }'></div>`;

    // const token = new Token(state.tokenCount)

    // Check if there is a place for an extra token.
    if (checkAddiablity(div)) {
      div.insertAdjacentHTML("beforeend", tokenDiv);
      // token._renderToken(e.target.dataset.columnId)
      state.validationObj[columnKey].push({
        token,
        tokenId: state.tokensCounter,
      });
      checkResult(columnKey);
      shiftPlayer();
    }
    console.log(state.validationObj);
  });
}

/**
 * Changing click type to single click as double click doesn't work on mobile simulator.
 */
function checkScreenWidth() {
  if (window.innerWidth < 700) {
    state.clickType = CONSTANTS.CLICK;
    document.querySelector("#dblClick").checked = false;
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
  document.querySelector(".columns-container").innerHTML = "";
  for (let i = 0; i < state.columns; i++) {
    const div = document.createElement("div");
    div.setAttribute("data-column-id", i);
    document.querySelector(".columns-container").appendChild(div);
    state.validationObj[i] = [];
    initColumnActions(div, i);
  }
  console.log(state.validationObj);
}

function deleteAllToken() {
  document.querySelectorAll("[data-token-id]").forEach((el) => el.remove());
}

/**
 *
 * @param {div} div the column in which the token will be added
 * @returns true when there is a place for another token else returns false.
 */
function checkAddiablity(div) {
  const tokens = div.querySelectorAll(".token");

  if (tokens.length === 0) {
    return true;
  }
  if (tokens.length > 0) {
    const tokenHeight = tokens[0].offsetHeight;

    const leftSpace = div.offsetHeight - tokens.length * tokenHeight;
    if (leftSpace > tokenHeight) {
      return true;
    } else {
      return false;
    }
  }
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
  console.log("The winner is the", winner);
  console.log("array of tokens", tokensArray);
  for (let token of tokensArray) {
    document
      .querySelector(`[data-token-id='${token.tokenId}']`)
      .classList.add("winner");
  }
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
//#endregion

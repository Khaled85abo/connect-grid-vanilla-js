/**
 *
 * ENTRY POINT
 *
 */
///#region
const state = {};

function main() {
  initState();
  showPlayer();
  getInputValues();
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
  state.turn = Math.random() > 0.5 ? true : false;
  state.tokensCounter = 0;
  state.infoShown = false;
  state.maxTokens;
  state.columns;
  state.gridsToConnect;
  state.validationObj = {};
  //   state.validationObj = {
  //     0: [1, 1, 2, 1],
  //     1: [2, 1, 1, 2],
  //     2: [1, 1, 1, 2],
  //     3: [2, 2, 2, 1],
  //   };
}

function getInputValues() {
  state.columns = Number(document.querySelector("#columns").value);
  state.gridsToConnect = Number(document.querySelector("#tokens").value);
  renderInputValues();
}

function handleInputChange() {
  state.columns = Number(document.querySelector("#columns").value);
  state.gridsToConnect = Number(document.querySelector("#tokens").value);
  renderInputValues();
  renderColumns();
}

function shiftPlayer() {
  state.turn = !state.turn;
  state.tokensCounter++;
  showPlayer();
}

function checkResult(columnKey) {
  // console.log(state.validationObj[columnKey].length, state.gridsToConnect);
  const column = state.validationObj[columnKey];
  const gridsToConnect = state.gridsToConnect;
  if (column.length === gridsToConnect || column.length > gridsToConnect) {
    checkVertically(columnKey);
  }
  checkHorizantally(columnKey);
  checkDiagonally(columnKey);
}

function checkVertically(columnKey) {
  const column = state.validationObj[columnKey];
  let lastToken = column[column.length - 1].token;
  for (
    let i = column.length - 2;
    i >= column.length - state.gridsToConnect;
    i--
  ) {
    if (lastToken !== column[i].token) {
      return false;
    }
    lastToken = column[i].token;
  }
  announceWinner(
    lastToken,
    state.validationObj[columnKey].length - 1,
    columnKey
  );
}

function checkHorizantally(columnKey) {
  const column = state.validationObj[columnKey];
  const lastToken = column[column.length - 1];
  const theTokenIndex = column.length - 1;
  // console.log("lastToken", lastToken);
  // console.log("lastToken index", theTokenIndex);

  // When token is in the last column
  // if (!state.validationObj[columnKey + 1]) {
  //   for (let i = 0; i <= state.gridsToConnect - 1; i++) {
  //     // console.log(state.validationObj[columnKey - i][theTokenIndex]);
  //     if (state.validationObj[columnKey - i][theTokenIndex] !== lastToken) {
  //       return false;
  //     }
  //   }
  //   const winner = lastToken === 1 ? "first player" : "second player";
  //   announceWinner(winner);
  // }

  // When token is in the first column
  // if (!state.validationObj[columnKey - 1]) {
  //   console.log("first column");
  //   for (let i = 0; i <= state.gridsToConnect - 1; i++) {
  //     // console.log(state.validationObj[columnKey + i][theTokenIndex]);
  //     if (state.validationObj[columnKey + i][theTokenIndex] !== lastToken) {
  //       return false;
  //     }
  //   }
  //   const winner = lastToken === 1 ? "first player" : "second player";
  //   announceWinner(winner);
  // }

  // When token is in inner column
  // creating arraies where the token occupiees all possibles positions
  // and checking if any array contains the same tokens.
  let validationArraies = [];

  console.log("token index: ", theTokenIndex);
  for (let i = 0; i < state.gridsToConnect; i++) {
    console.log("column index: ", columnKey - i);
    const output = createHorizontalArray(columnKey - i, theTokenIndex);
    if (output) {
      validationArraies.push(output);
    }
  }
  console.log("validationArraies", validationArraies);
  for (let arr of validationArraies) {
    let match = true;
    let token = arr[0];
    for (let el of arr) {
      if (el !== token) {
        match = false;
      }
    }
    if (match) {
      announceWinner(token, theTokenIndex, columnKey);
    }
    console.log("match: ", match, token);
  }
}

function createHorizontalArray(columnIndex, theTokenIndex) {
  let variation = [];
  // if (columnIndex >= 0) {
  for (let j = columnIndex; j < columnIndex + state.gridsToConnect; j++) {
    if (j >= 0 && j < state.columns) {
      // if (state.validationObj[j][theTokenIndex]) {
      //   console.log(
      //     "elemnet from validation object: ",
      //     state.validationObj[j][theTokenIndex]
      //   );
      //   variation.push(state.validationObj[j][theTokenIndex]);
      // }
      variation.push(state.validationObj[j][theTokenIndex]);
    }
  }
  let filteredVariation = variation.filter((item) => item !== undefined);
  console.log("filtered variatin array:", filteredVariation);
  if (filteredVariation.length === state.gridsToConnect) {
    return filteredVariation;
  }
  // }
}

function checkDiagonally(columnKey) {}

//#endregion

/***
 *
 * CONTROLLERS
 *
 */
//#region

function initActions() {
  document
    .querySelector("#columns")
    .addEventListener("change", handleInputChange);
  document
    .querySelector("#tokens")
    .addEventListener("change", handleInputChange);
}

function initDivAction(div, columnKey) {
  div.addEventListener("dblclick", () => {
    const token = state.turn ? 1 : 0;
    const tokenDiv = `<div data-token-id=${state.tokensCounter} class='token ${
      state.turn ? "red" : "blue"
    }'></div>`;
    if (checkAddiablity(div)) {
      div.insertAdjacentHTML("beforeend", tokenDiv);
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

//#endregion

/**
 *
 * VIEW
 *
 */
//#region

function renderInputValues() {
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

function renderColumns() {
  console.log(state.tokensCounter);
  document.querySelector(".columns-container").innerHTML = "";
  for (let i = 0; i < state.columns; i++) {
    const div = document.createElement("div");
    div.setAttribute("data-column-id", i);
    document.querySelector(".columns-container").appendChild(div);
    state.validationObj[i] = [];
    initDivAction(div, i);
  }
  console.log(state.validationObj);
}

function announceWinner(token, tokenIndex, coulmnindex) {
  const winner = token === 1 ? "first player" : "second player";
  console.log("The winner is the", winner);
}

//#endregion

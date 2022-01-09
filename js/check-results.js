export { checkVertically, checkHorizantally, checkDiagonally };

function checkVertically(columnKey, validationObj, gridsToConnect) {
  const column = validationObj[columnKey];
  let lastToken = column[column.length - 1].token;
  const tokensArray = [column[column.length - 1]];
  for (let i = column.length - 2; i >= column.length - gridsToConnect; i--) {
    if (lastToken !== column[i].token) {
      return false;
    }
    tokensArray.push(column[i]);
    // lastToken = column[i].token;
  }
  return { lastToken, tokensArray };
  // announceWinner(lastToken, tokensArray);
}

function checkHorizantally(columnKey, validationObj, gridsToConnect, columns) {
  const column = validationObj[columnKey];
  const lastToken = column[column.length - 1].token;
  const theTokenIndex = column.length - 1; // It is always the last token added in a column that is going to be the start token

  // creating arraies where the token occupiees all possibles positions
  // and checking if any array contains the same tokens.
  let validationArraies = [];

  // console.log("token index: ", theTokenIndex);
  for (let i = 0; i < gridsToConnect; i++) {
    // extract token from nearby columns with the same token level (index).
    const output = createHorizontalArrays(
      columnKey - i,
      theTokenIndex,
      validationObj,
      gridsToConnect,
      columns
    );
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
      return { token, arr };

      //announceWinner(token, arr);
    }
  }
}

function createHorizontalArrays(
  columnIndex,
  theTokenIndex,
  validationObj,
  gridsToConnect,
  columns
) {
  let output = [];
  for (let j = columnIndex; j < columnIndex + gridsToConnect; j++) {
    if (j >= 0 && j < columns) {
      output.push(validationObj[j][theTokenIndex]);
    }
  }
  // filtering out all undefined values from output array
  let filteredOutput = output.filter((item) => item !== undefined);
  // Returning only output array that has as many items as gridsToConnect
  if (filteredOutput.length === gridsToConnect) {
    return filteredOutput;
  }
}

function checkDiagonally(columnKey, validationObj, gridsToConnect, columns) {
  const column = validationObj[columnKey];
  const theTokenIndex = column.length - 1; // It is always the last token added in a column that is going to be the start token

  // creating arraies where the token occupiees all possibles positions
  let validationArraies = [];

  // with 135 tilting
  for (let i = 0; i < gridsToConnect; i++) {
    const output = createDiagonal135DegArrays(
      columnKey - i,
      theTokenIndex + i,
      validationObj,
      gridsToConnect,
      columns
    );
    if (output) {
      validationArraies.push(output);
    }
  }

  // with 45 tilting
  for (let i = 0; i < gridsToConnect; i++) {
    const output = createDiagonal45DegArrays(
      columnKey - i,
      theTokenIndex - i,
      validationObj,
      gridsToConnect,
      columns
    );
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
      return { token, arr };

      // announceWinner(token, arr);
    }
  }
}

function createDiagonal135DegArrays(
  columnIndex,
  theTokenIndex,
  validationObj,
  gridsToConnect,
  columns
) {
  let output = [];

  let startTokenIndex = theTokenIndex;
  for (let j = columnIndex; j < columnIndex + gridsToConnect; j++) {
    if (j >= 0 && j < columns) {
      output.push(validationObj[j][startTokenIndex]);
      startTokenIndex--;
    }
  }
  // filtering out all undefined values from output array
  let filteredOutput = output.filter((item) => item !== undefined);
  // Returning only output array that has as many items as gridsToConnect
  if (filteredOutput.length === gridsToConnect) {
    return filteredOutput;
  }
}

function createDiagonal45DegArrays(
  columnIndex,
  theTokenIndex,
  validationObj,
  gridsToConnect,
  columns
) {
  let output = [];

  let startTokenIndex = theTokenIndex;
  for (let j = columnIndex; j < columnIndex + gridsToConnect; j++) {
    if (j >= 0 && j < columns) {
      output.push(validationObj[j][startTokenIndex]);
      startTokenIndex++;
    }
  }
  // filtering out all undefined values from output array
  let filteredOutput = output.filter((item) => item !== undefined);
  // Returning only output array that has as many items as gridsToConnect
  if (filteredOutput.length === gridsToConnect) {
    return filteredOutput;
  }
}

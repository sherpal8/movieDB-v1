module.exports = {
  parseSortString: function(sortString, defaultSort) {
    let s = sortString || defaultSort || "";
    const result = { column: "", direction: "asc" };

    // split string on the space character into an array of tokens
    s = s.split(" ");

    // if no tokens, return null
    if (s.length < 1) {
      return null;
    }

    // if at least 1 token given, set the sort column as the 1st token
    result.column = s[0];

    // if column is empty, to return null
    if (!result.column) {
      return null;
    }

    // if only one token, to return results that sorts by that column in default ASC order
    if (s.length === 1) {
      return result;
    }

    // if two tokens given, check if second token is a request for DESC order
    if (s[1].toLowerCase().startsWith("desc")) {
      result.direction = "desc";
    }

    return result;
  },
  // given an array if ids e.g. [1,2]
  // returns new array of many-to-many (M:M) object
  // example [{person_id:1, movie_id:4}, {person_id:2, movie_id:4}]
  idToMMObjArr: function(fieldName1, idArray, fieldName2, otherId) {
    return idArray.map(function(eachId) {
      let singleObj = {};
      singleObj[fieldName1] = eachId;
      singleObj[fieldName2] = otherId;
      return singleObj;
    });
  },
  // Returns an object with the add/ delete changes, to make a many-to-many table
  // given the new/ existing ids
  getMMDelta: function(
    newIDs,
    currentIDs,
    variableFieldName,
    constFieldName,
    constID
  ) {
    let additionArr = [],
      deletionArr = [];
    // look for IDs in newIDs that are not in currentIDs. These will be ADDs. ([{},{}] of many:many objs)
    newIDs.forEach(function(eachNewID) {
      if (!currentIDs.includes(eachNewID)) {
        const pushObj = {};
        pushObj[variableFieldName] = eachNewID;
        pushObj[constFieldName] = constID;
        additionArr.push(pushObj);
      }
    });
    // look for IDs in currentIDs to are not in newIDs. These will be DELETEs. ([] of ids only i.e. numbers)
    currentIDs.forEach(function(eachCurrentID) {
      if (!newIDs.includes(eachCurrentID)) {
        deletionArr.push(eachCurrentID);
      }
    });
    return { additionArr, deletionArr };
  }
};

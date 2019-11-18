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
    if (s[1].toLowerCase() === "desc") {
      result.direction = "desc";
    }

    return result;
  }
};

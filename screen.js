const prettyjson = require("prettyjson");

module.exports = {
  clearTerminalScreen: function() {
    process.stdout.write("\033c");
  },
  write: function(data, mode) {
    let output = data;
    if (mode === "json") {
      output = JSON.stringify(output, null, 4);
    } else if (mode === "pretty") {
      let prettyOptions = {
        keyColor: "cyan",
        dashColor: "magenta",
        stringColor: "white",
        numberColor: "yellow"
      };
      output = prettyjson.render(output, prettyOptions);
    }
    console.log(output);
  }
};

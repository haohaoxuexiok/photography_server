const http = require("http");

http
  .createServer(function (req, res) {})
  .listen(80, () => {
    console.log("server is running on port 80");
  });

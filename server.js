const Express = require("express");
let app = Express();
app.use(Express.static(__dirname));
app.listen(80, "localhost", () => console.log("running"));
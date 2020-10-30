const express = require('express');
const config = require('./config/index');
const expressConfig = require('./config/express');
const routerConfig = require("./routes");
const path = require('path')

// Setup server
const app = express();
require('./database.js')

app.set("view options", {
    layout: false
});
app.set("views", __dirname + "/public");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static(path.join(__dirname, "/public")));
expressConfig(app);

// Routes
routerConfig(app);


app.listen(config.port, () => {
    console.log(`Server online on port ${config.port}`)
})

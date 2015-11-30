var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

var app = express();

// config files
var db = require('./config/db');

// set port
var port = process.env.PORT || db.port;

// mongoDB
mongoose.connect(db.mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('Connected to mongodb');
});

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location
app.use(express.static(__dirname + '/public'));

// configure routes
require('./app/routes')(app);

// start app at http://localhost:8080
app.listen(port);

console.log('Connected to port ' + port);

//expose app
exports = module.exports = app;

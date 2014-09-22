/**
 * An express server to serve a SPA app
 * we use express to simplify handling of static files 
 * whilst directing all paths to main index.html 
 * for handling browser refresh
 * a more complicate solution using standard modules can be found here:
 * https://coderwall.com/p/b2kmkg
 * an interesting discussion:
 * http://stackoverflow.com/questions/7268033/basic-static-file-server-in-nodejs
 */
var express = require('express'),
        app = express(),
		staticDir = (process.env.NODE_ENV || "development") === "production" ? "dist" : "public";
		
app.use(express.static(__dirname + '/' + staticDir));

app.get('*', function (req, res) {
	res.sendfile(__dirname + '/' + staticDir + '/index.html');
});

var server = app.listen(process.env.PORT || 8088, function() {
    console.log('Listening on port %d', server.address().port);
});
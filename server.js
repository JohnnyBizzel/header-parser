var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
  
  if (req.url === "/") {
  		fs.readFile("./index.html", "UTF-8", function (err, html) {
  			res.writeHead(200, {"Content-Type": "text/html"});
	  		res.end(html);	
  		});
  } else if (req.url == "/api") {
  		var lang = req.headers['accept-language'].split(";")[0];
		var usrAgt = req.headers['user-agent'];
		 /* c/o arshdkhn1 
		 If you are running your app behind Nginx or any proxy, every single IP addresses will be 127.0.0.1 😀
		 Probably you can see the problem now. So what is the solution?
	  	 Look for the originating IP address in the X-Forwarded-For HTTP header. 
	  	 You will find it in req.header('x-forwarded-for'). 
	  	 Considering that fact, here is the best way to get the IP address of a user:
	    var ip = req.headers('x-forwarded-for') || req.connection.remoteAddress;
	    Now you can be sure the variable ip will catch the IP address of the client, not your proxy's. */
		var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	  
	  res.writeHead(200, {"Content-Type": "text/plain"});
	
	// get IP etc of the user
	  var respObject = {	   
	    ipaddress: ip,
	    "language": lang,
	    "software": usrAgt
	  };
	  res.end(JSON.stringify(respObject));
  
  } else {
	// 404 not found  
		res.writeHead(404,  {"Content-Type": "text/plain"} );
		res.end("404 - File not found");
  }
  
	 
});


var portNo = 3000;
if (!isNaN(process.env.PORT)) { 
  
  server.listen(process.env.PORT, function() {
    console.log('Express started on http://localhost:' +
        process.env.PORT + '; press Ctrl-C to terminate');
  });
} else {
  server.listen(portNo, function() {
    console.log('Express started on http://localhost:' +
        portNo + '; press Ctrl-C to terminate');
  });
}
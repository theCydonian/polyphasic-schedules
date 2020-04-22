//imports
var http = require('http');
var fs = require('fs');
var url = require('url');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const { parse } = require('querystring');
const {OAuth2Client} = require('google-auth-library');

//define client ID
const CLIENT_ID = '823193981476-g3d9mrtsl15rbdtt4k3thjg1t66icaa2.apps.googleusercontent.com';

const client = new OAuth2Client('823193981476-g3d9mrtsl15rbdtt4k3thjg1t66icaa2.apps.googleusercontent.com');

// Connection URL
const dburl = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const mongoClient = new MongoClient(dburl);

//define url paths
var urls = {
  '/': "./html/index.html"
};

//defines potential types
var types = {
  'html': "text/html",
  'css': "text/css"
}

// Command Line Arg Parsing
console.log("Parsing command line arguments");
var args = process.argv.slice(2);
var port = 8888;
var set = false;
for (var i = 0; i < args.length; i++) {
  if ((args[i] == "-p" || args[i] == "--port") && args.length >= i) {
    if (args[i+1][0] != "-") {
      port = args[i+1];
      console.log("Found port argument " + port);
      set = true;
    }
  }
}
if (!set) {
  console.log("No port found");
  console.log("Defaulting to port 8888");
}



const server = http.createServer(function (req, res) {

  console.log('\nReceived HTTP Request');

  if (req.method == 'GET') {

    console.log('Req Type: GET');

    // URL Parsing
    var parsed = url.parse(req.url, true);
    console.log('pathname: ' + parsed.pathname);

    var file = urls[parsed.pathname];
    if (!file) {
      file = '.' + parsed.pathname;
    }
    console.log('file: ' + file);

    // defines file type
    var type = file.split('.');
    if (type.length < 3) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      console.log("resource not found!\n");
      return res.end("404 Not Found");
    } else {
      type = types[type[2].toLowerCase()];
      if (type) {
        console.log("type: " + type);
      }
    }

    // reads the file
    fs.readFile(file, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        console.log("resource not found!\n");
        return res.end("404 Not Found");
      }
      if (type) {
        res.writeHead(200, {'Content-Type': type});
      }
      res.write(data);

      return res.end();
    });

  } else if (req.method == 'POST') {

    console.log('Req Type: POST');
    // URL Parsing
    var parsed = url.parse(req.url, true);
    console.log('pathname: ' + parsed.pathname);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      const parsedBody = parse(body);
      switch(parsed.pathname.toLowerCase()) {
        case '/tokensignin':
          //token verification
          token = parsedBody['idtoken'];
          const ticket = client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
          }).then(value => {
            payload = value.getPayload();
            res.end(payload['name']);
          });
          break;
        default:
          res.end('received request');
          break;
      }
    });

  }
});

function insertDatum(id_hash, obj) {
  // Use connect method to connect to the server
  mongoClient.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to the MongoDB server");

    const db = mongoClient.db(dbName);

    db.collection(id_hash).insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      mongoClient.close();
    });
  });
}

function insertInitMemory(id_hash, seed) {
  // Use connect method to connect to the server
  mongoClient.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to the MongoDB server");

    const db = mongoClient.db(dbName);

    const query = { idHash: id_hash };
    dbo.collection("memoryTests").deleteMany(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });

    const obj = { 'idHash': id_hash, 'seed': seed, 'time': Date.now() };

    db.collection("memoryTests").insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      mongoClient.close();
    });
  });
}

function getTimeDiffMemory(id_hash) {
  // Use connect method to connect to the server
  var out = 0;
  mongoClient.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to the MongoDB server");

    const db = mongoClient.db(dbName);

    const query = { idHash: id_hash };
    dbo.collection("memoryTests").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      out = Date.now() - result[0][time];
      db.close();
    });
  });
  return out;
}

// Starts up server
const host = '127.0.0.1';
console.log("\nInitializing server on port " + port + "\n");
server.listen(port, host);

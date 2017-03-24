var	express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	app = express();

// db connection string
// var config = {
//   user: 'receipeTest', //env var: PGUSER
//   database: 'ReceipeBook', //env var: PGDATABASE
//   password: ' ', //env var: PGPASSWORD
//   host: 'localhost', // Server hosting the postgres database
//   port: 5432, //env var: PGPORT
//   max: 10, // max number of clients in the pool
//   idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
// };


// //this initializes a connection pool
// //it will keep idle connections open for 30 seconds
// //and set a limit of maximum 10 idle clients
// var pool = new pg.Pool(config);

var connect = "postgres://resume:1234@localhost/resumes";

app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req,res){
	// res.render('index');
	// console.log('TEST');

	//PG connect
	pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * FROM applicants', function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
    res.render('index', {applicants: result.rows});
    done();
    // console.log(result.rows[0].number);
    // //output: 1
  });
});
});
app.post('/add', function(req,res){
	pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query("INSERT INTO applicants(firstname, lastname, email, position) VALUES ($1, $2, $3, $4)", [req.body.firstname, req.body.lastname, req.body.email, req.body.position]);
  done();
  res.redirect('/');
});
});

app.post('/search', function(req,res){
  pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query("SELECT * FROM managers WHERE username = $1 AND password = $2", [req.body.username, req.body.password], function(err, result) {
     done();
  // console.log(result.rows[0].password);
  // console.log(req.body.username);
  // console.log(req.body.password);
  // console.log(result.rowCount);
if(result.rowCount==1)
  res.redirect('/managers');
else if(result.rowCount==0){
  console.log("not a manager");
  res.redirect('/');
}
});
});
});

app.get('/managers', function(req,res){
  // res.render('index');
  // console.log('TEST');

  //PG connect
  pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * FROM applicants', function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
    res.render('managers', {applicants: result.rows});
    done();
    // console.log(result.rows[0].number);
    // //output: 1
  });
});
});

app.delete('/delete/:id', function(req,res){
	pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query("DELETE FROM applicants WHERE id = $1", [req.params.id]);
  done();
  res.sendStatus(200);
});
});
// app.get('/search-resume', function(req,res){
//   pg.connect(connect, function(err, client, done) {
//   if(err) {
//     return console.error('error fetching client from pool', err);
//   }
//   client.query('SELECT * FROM applicants WHERE to_tsvector("english", body) @@ to_tsquery("english", "$1")',[req.body.search]);

//   //   if(err) {
//   //     return console.error('error running query', err);
//   //   }
//   //   // res.render('managers', {applicants: result.rows});
//     done();

//   // });
// });
// });


app.listen(3000, function(){
	console.log('Server started');
});


var	express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	fs = require('fs'),
	app = express();



var connect = "postgres://resume:1234@localhost/resumes";

app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req,res){

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

  });
});
});

app.post('/search-resume', function(req,res){

	//PG connect
	pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * FROM applicants WHERE firstname LIKE $1 || $2 || $1',['%',req.body.searchchar],  function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
		console.log(req.body.searchchar);

    res.render('managers', {applicants: result.rows});
    done();

  });
});
});

app.post('/sort', function(req,res){

	//PG connect
	pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
	console.log(req.body.ascending);
	console.log(req.body.descending);
	if(req.body.ascending!=undefined){
  client.query('SELECT * FROM applicants ORDER BY firstname ASC',  function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
    res.render('managers', {applicants: result.rows});
    done();

  });
}
	else if(req.body.descending!=undefined){
		client.query('SELECT * FROM applicants ORDER BY firstname DESC',  function(err, result) {

	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.render('managers', {applicants: result.rows});
	    done();

	  });

	}
});
});

app.post('/sortL', function(req,res){

	//PG connect
	pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }

	if(req.body.ascendingL!=undefined){
  client.query('SELECT * FROM applicants ORDER BY lastname ASC',  function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
    res.render('managers', {applicants: result.rows});
    done();

  });
}
	else if(req.body.descendingL!=undefined){
		client.query('SELECT * FROM applicants ORDER BY lastname DESC',  function(err, result) {

	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.render('managers', {applicants: result.rows});
	    done();

	  });

	}
});
});

app.post('/add', function(req,res){
	console.log(req.body.position);
	pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }

  client.query("INSERT INTO applicants(firstname, lastname, email, position,resumefile) VALUES ($1, $2, $3, $4, $5)", [req.body.firstname, req.body.lastname, req.body.email, req.body.position, req.body.inputfile]);
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



app.listen(3000, function(){
	console.log('Server started');
});

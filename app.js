var	express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	fs = require('fs'),
	multer = require('multer'),
	app = express();


var connect = "postgres://resume:1234@localhost/resumes";

app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', function(req,res){
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

app.get('/resume/:id', function(resuest, response) {
	pg.connect(connect, function(err, client, done) {
	console.log(resuest.params.id);
	client.query('SELECT * FROM applicants where id = $1',[resuest.params.id], function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }

		response.download(result.rows[0].resumefile.trim(), result.rows[0].resume_original.trim());

    done();

  });
});
});

// UPLOAD A NEW APPLICATION
var upload = multer({ dest: './upload/'});
var type = upload.single('file');
app.post('/upload',type, function (req,res) {

  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;

	console.log(req.file);

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  // var target_path = '/upload/' + req.file.originalname;

// var src = fs.createReadStream(tmp_path);
//   var dest = fs.createWriteStream(target_path);
//   src.pipe(dest);
//   src.on('end', function() { res.render('complete'); });
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/')
//   },
//   filename: function (req, file, cb) {
//     crypto.pseudoRandomBytes(16, function (err, raw) {
//       cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
//     });
//   }
// });
// var upload = multer({ storage: storage });

	pg.connect(connect, function(err, client, done) {
	if(err) {
		return console.error('error fetching client from pool', err);
	}
	client.query('INSERT INTO applicants (firstname, lastname, email, position, resumefile, resume_original) VALUES ($1, $2, $3, $4, $5, $6)',[req.body.firstname, req.body.lastname, req.body.email, req.body.position, req.file.path, req.file.originalname]);

	done();

  res.redirect('/');

});
});

//SEARCHING IN MANAGERS
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

//SORTING IN FIRSTNAME MANAGERS
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

//SORTING IN LASTNAME MANAGERS
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

//FILTER BY POSITION
app.post('/filter', function(req,res){

	//PG connect
	pg.connect(connect, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
console.log(req.body.positionF[0]);
  client.query('SELECT * FROM applicants WHERE position=$1',[req.body.positionF[0]],  function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
    res.render('managers', {applicants: result.rows});
    done();

  });


});
});

//VERIFYING THE MANAGER
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
//MAIN VIEW OF MANAGERS
app.get('/managers', function(req,res){
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

//DELETE APPLICATION
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

module.exports = app;

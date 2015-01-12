
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var database_manager = require('./gridEngine/database_manager');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var job =   {   
                name: "test",
                tasks:[
                    {apiurl: '/js/CalculPI.js', jscode:'console.log("task1");','input': {x: Math.random(), y: Math.random()}},
                    {apiurl: '/js/CalculPI.js', jscode:'console.log("task2");','input': {x: Math.random(), y: Math.random()}},
                    {apiurl: '/js/CalculPI.js', jscode:'console.log("task3");','input': {x: Math.random(), y: Math.random()}}
                ]
            }
var tasknum = 0;

/**
  * Get the next task to be done (action performed by a computing engine).
  */
//console.log(JSON.stringify(job, null, 4));
app.get('/task', function(req, res) {
    console.log('task '+tasknum);
    //console.log(JSON.stringify(job.tasks[tasknum], null, 4));
    res.render('task', {title: job.name, task: job.tasks[tasknum]} );
});

/**
 *  Add tasks to the pool (client-side)
 */

// Job form generation
app.get('/add_job', function(req, res) {
    res.render('add_job');
});

// Job form submission : store tasks in DB
app.post('/add_job', function(req, res) {
  var form = {externalApiUrl : req.param('externalApiUrl'), embeddedApi : req.param('embeddedApi'), tasks : req.param('tasks') };
  database_manager.add_job(form.externalApiUrl, form.embeddedApi, form.tasks);
  res.render('job_added', {externalApiUrl : req.param('externalApiUrl'), embeddedApi : req.param('embeddedApi'), tasks : req.param('tasks') });
});

/**
  * Display all the tasks that were sent to the server
  */
app.get('/tasks_list', function(req, res) {
  // get_all_tasks will perform the callback below after retrieving all rows (tasks) in the database.
  database_manager.get_all_tasks(function(err, _tasks_list) {
    res.render('tasks_list', {tasks_list : _tasks_list} );
  }); 
});


app.post('/result', function(req, res) {
    //console.log("post result");
    job.tasks[tasknum].result = req.body.insideCircle;
    //console.log(JSON.stringify(job.tasks[tasknum], null, 4));
    console.log('result '+tasknum);
    tasknum++;
    if(tasknum==job.tasks.length-1)
        res.send('end');
    else
        res.send('next');
});

http.createServer(app).listen(app.get('port'), function(){
  database_manager.open_db();
  console.log("Express server listening on port " + app.get('port'));
});

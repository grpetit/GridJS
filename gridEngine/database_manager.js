/**
 *  Database module dependency
 */
var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");
var dbFile = "./gridEngine/tasks.db";
var exists = fs.existsSync(dbFile);
var db = new sqlite3.Database(dbFile);
var uuid = require('node-uuid');
var check;

// Create the database if it does not already exists
exports.open_db = function() {
  console.log('exists ? '  + exists);
  if (!exists) {
    db.run("CREATE TABLE tasks (jobname TEXT, apiurl TEXT, jscode TEXT, input TEXT, status TEXT)");
    console.log('table was created');
  }
};

exports.close_db = function() { db.close() };

/**
  * Add the tasks contained in a job into the database.
  * The expected format for the "_tasks" parameter is :
  * [{"input": "[Math.random(), Math.random()]"}, {"input": "arg1, arg2, arg3]"}]
  */
exports.add_job = function (_apiUrl, _jsCode, _tasks) {
    var job_id = uuid();
    var stmt = db.prepare("INSERT INTO tasks (jobname, apiurl, jscode, input, status) VALUES (?, ?, ?, ?, ?)");
    var tasks = JSON.parse(_tasks);
    for (var i in tasks) {
      stmt.run('job' + job_id, _apiUrl, _jsCode, tasks[i].input, 'undone');
    };
    stmt.finalize();
}

/**
  * "Returns" all the tasks to the callback function.
  */
exports.get_all_tasks = function(callback) {
  var tasks_list = [];
  db.all("SELECT * FROM tasks", function(err, rows) {
    callback(err, rows);
  });
}

exports.get_next_undone_task = function() {
    db.all("SELECT id from tasks where ")
}
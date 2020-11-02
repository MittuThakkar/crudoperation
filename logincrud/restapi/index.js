const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRound = 10;
// parse application/json
app.use(bodyParser.json());

//user cors middleware
app.use(cors())

//Create Database Connection
const conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "crud",
});

// connect to database
conn.connect((err) => {
	if (err) throw err;
	console.log("MySQL connected");
});

// creat a new Record
app.post("/api/create", (req, res) => {
	let data = { username: req.body.username, password: req.body.password };
	let sql = "INSERT INTO users SET ?";
	let query = conn.query(sql, data, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: "New Record is Added successfully" }));
	});
});

//register 
// app.post('/api/register',(req,res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     res.send(JSON.stringify({ status: 200, error: null, response: "Register successfully..!" }));
//     bcrypt.hash(password, saltRound, (err,hash)=>{
//         if(err){
//             console.log(err);
//         }
//       conn.query(
//           "INSERT INTO users (username, password) VALUES (?,?)",
//           [username, hash],
//           (err, result) => {
//             console.log(err);
//           }
//         );
//       });
// })

// show all records
app.get("/api/view", (req, res) => {
	let sql = "SELECT * FROM users";
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
});

// show a single record
app.get("/api/view/:id", (req, res) => {
	let sql = "SELECT * FROM users WHERE id=" + req.params.id;
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
});

// delete the record
app.delete("/api/delete/:id", (req, res) => {
	let sql = "DELETE FROM users WHERE id=" + req.params.id + "";
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: "Record deleted successfully" }));
	});
});

// update the Record
app.put("/api/update/", (req, res) => {
	let sql = "UPDATE users SET username='" + req.body.username + "', password='" + req.body.password + "' WHERE id=" + req.body.id;
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: "Record updated SuccessFully" }));
	});
});

app.listen(8000, () => {
	console.log("server started on port 8000...");
});
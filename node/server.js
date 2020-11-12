console.log('Node with us')
const express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const url = 'mongodb://localhost:27017/mongoDB/data';

app.use(bodyParser.urlencoded({ extended: true }))
app.listen(3000, function() {
  console.log('listening on 3000')
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/insert.html',(req, res) => {
	res.sendFile(__dirname+ '/insert.html')
})

app.get('/retrive.html',(req, res) => {
	res.sendFile(__dirname+ '/retrive.html')
})

app.get('/delete.html',(req, res) => {
	res.sendFile(__dirname+ '/delete.html')
})

app.get('/deleteitem.html',(req, res) => {
	res.sendFile(__dirname+ '/deleteitem.html')
})

app.get('/update.html',(req, res) => {
	res.sendFile(__dirname+ '/update.html')
})

app.get('/updateitem.html',(req, res) => {
	res.sendFile(__dirname+ '/updateitem.html')
})

app.get('/updateitemsuccess.html',(req, res) => {
	res.sendFile(__dirname+ '/updateitem.html')
})

const dbName = 'group-info'
let db

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) return console.log(err)

  db = client.db(dbName)
  console.log(`Connected MongoDB: ${url}`)
  console.log(`Database: ${dbName}`)
})
 
app.post('/insert.html', (req, res) => {
	var myobj = req.body
	console.log(myobj)
	MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },function(err, client) {
		if (err) throw err
		var operationDB = client.db(dbName)
		operationDB.collection("information").insertOne(myobj, function(err, res) {
			if (err) throw err
			console.log("1 document inserted")
			client.close()
		})
	})
	// res.status(200).send("Data is inserted successfully")
	res.status(200).redirect('insert.html')
})

var str = "<center><table style='border:0.5px solid;font-size:28px' width='70%'><tr style='background-color:lightgreen'><th>Name</th><th>Role</th></tr>"

app.post('/retrive.html', (req, res) => {
	MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
		if (err) throw err
		var operationDB = client.db(dbName)
		operationDB.collection("information").find({}).toArray(function(err, result) {
			if (err) throw err
			var n = result.length
			while(n--){
				console.log(result[n]['name'] + result[n]['role'])
				str = str + "<tr><td>" + result[n]['name'] + "</td><td>" + result[n]['role'] + "</td></tr>"
			}
			str = str + "</table><br><br> <a href='http://localhost:3000' style='text-decoration:none;padding:10px;border:0.5px solid;border-radius:8px;color:white;background-color:green;font-size:28px'> Home </a></center>"
			client.close()
		})
	})
	
	res.status(200).send(str)
})

let str1 = ""
let str2 = ""
let str3 = ""

app.post('/delete.html', (req, res) => {
	MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
		if (err) throw err
		var operationDB = client.db(dbName)
		operationDB.collection("information").find({}).toArray(function(err, result_del) {
			str1 = "<center><h1>Select Name to delete</h1><br><br> <form action='deleteitem.html' method='POST'><select name='name' style='padding:10px;border:0.5px solid;border-radius:8px;color:black;background-color:lightgreen;font-size:28px'> "
			var n_del = result_del.length
			if (err) throw err
			while(n_del--)
				str2 = str2 + "<option value=" + result_del[n_del]['name'] + " >" + result_del[n_del]['name'] + "</option>"
			client.close()
			str3 = "</select><br><br><input type='submit' value='Delete selected item' style='padding:10px;border:0.5px solid;border-radius:8px;color:white;background-color:green;font-size:28px'> </form> </center> "
		})
	})
	
	res.status(200).send(str1+str2+str3)
})

app.post('/deleteitem.html', (req, res) => {
	MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
		if (err) throw err
		var operationDB = client.db(dbName)
		operationDB.collection("information").deleteOne(res.body)
		console.log(res.body)
		console.log("1 document deleted")
	})
	res.status(200).redirect('deleteitem.html')
})

let str1_upd = ""
let str2_upd = ""
let str3_upd = ""

app.post('/update.html', (req, res) => {
	MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
		if (err) throw err
		var operationDB = client.db(dbName)
		operationDB.collection("information").find({}).toArray(function(err, result_upd) {
			str1_upd = "<center><h1>Select Name to update</h1><br><br> <form action='updateitem.html' method='POST'><select name='_id' style='padding:10px;border:0.5px solid;border-radius:8px;color:black;background-color:lightgreen;font-size:28px'> "
			var n_upd = result_upd.length
			if (err) throw err
			while(n_upd--)
				str2_upd = str2_upd + "<option value=" + result_upd[n_upd]['_id'] + " >" + result_upd[n_upd]['name'] + "</option>"
			client.close()
			str3_upd = "</select><br><br>  <input type='submit' value='Continue' style='padding:10px;border:0.5px solid;border-radius:8px;color:white;background-color:green;font-size:28px'> </form> </center> "
		})
	})
	
	res.status(200).send(str1_upd+str2_upd+str3_upd)
})

let str_up_1 = ""
let str_up_2 = ""
let str_up_3 = ""
let str_up_4 = ""

app.post('/updateitem.html', (req, res) => {
	MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
		if (err) throw err
		var operationDB = client.db(dbName)
		
		str_up_1 = "<center><h1> Update information " + req.body._id + "</h1><br><br><form action='updateitemsuccess.html' method='POST'>"
		str_up_2 = "<input type='hidden' name='_id' value='" + req.body._id + "'> <input type='text' placeholder='Class' name='class' style='padding:10px;border:0.5px solid;border-radius:8px;color:black;background-color:lightgreen;font-size:28px'><br><br>"
		str_up_3 = "<input type='text' placeholder='Role' name='role' style='padding:10px;border:0.5px solid;border-radius:8px;color:black;background-color:lightgreen;font-size:28px'><br><br>"
		str_up_4 = "<input type='submit' value='Continue' style='padding:10px;border:0.5px solid;border-radius:8px;color:white;background-color:green;font-size:28px'> </form> </center> "
	})
	res.status(200).send(str_up_1+str_up_2+str_up_3+str_up_4)
})

app.post('/updateitemsuccess.html', (req, res) => {
	MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
		if (err) throw err
		var operationDB = client.db(dbName)
		console.log(req.body)
		var updatequery = "{ _id: ObjectId(" + req.body._id + ") }"
		var newvalue = " {$set:{ " + req.body + " }}"
		var update_id = req.body._id
		newvalue = req.body
		// operationDB.collection("information").updateOne(updatequery, newvalue, function(err, res){
			// if (err) throw err
			// console.log("1 document updated")
			// client.close()
		// })
		async function updateInfo(){
			const result = await operationDB.collection("information").updateOne(updatequery,{$set:{role:req.body.role}}, function(err, res){
				if (err) throw err
				console.log("1 document updated")
				console.log(result)
				client.close()
			})
		}
		
	})
	res.status(200).redirect('updateitemsuccess.html')
})
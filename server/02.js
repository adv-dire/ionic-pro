var express = require("express");
var app = express();
var db = require("./model/db.js");
//var MongoClient = require("mongodb").MongoClient;
app.get("/",function(req,res){

	db.insertOne("teacher",{"name":"小红"},function(err,result){
		if (err) {
			console.log("charu");
			return;
		};
		res.send("插入成功");
	});
})

app.get("/du",function(req,res){
	var page = parseInt(req.query.page);
	db.find("student",{},{"pageamount":6,"page":page},function(err,result){
		if (err) {
			console.log("charu");
			return;
		};
		console.log(result);
		res.send();
	});
})
app.get("/shan",function(req,res){
	var restayrant_id =req.query.idd;
	console.log(restayrant_id);
	db.deleteMany("student",{"idd":restayrant_id},function(err,result){
		res.send(result);
	})
})

app.get("/xiugai",function(req,res){
	db.updataMany("student",{"age":"50"},{$set:{"name":"高杰豪"},
},function(err,result){
	if (err) {
		console.log(err);
		return;
	};
		res.send(result);
	})
})
app.listen(3000);
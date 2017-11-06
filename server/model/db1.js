var MongoClient = require("mongodb").MongoClient;
var setting = require("../settings.js")
function _connectDB(callback){
	var url = setting.dburl;
	MongoClient.connect(url,function(err,db){
		callback(err,db);
	})
}
exports.insertOne = function(collectionName,json,callback){
	_connectDB(function(err,db){
		db.collection(collectionName).insertOne(json,function(err,result){
			callback(err,result);
			db.close();
		})
})
}


//查找数据
exports.find = function(collectionName,json,C,D){
	//var json = json || {};
	var result = [];
	if (arguments.length == 3) {
		var callback = C;
		var skipnumber=0;
		var limit = 0;
		
	}else if(arguments.length == 4){
		var callback = D;
		var args = C;
		var skipnumber = args.pageamount * args.page || 0;
		var limit = args.pageamount || 0;
		var sort = args.sort || {};
	}else{
		throw new Error("find函数接受3个参数");
		return;
	}
	
	_connectDB(function(err,db){
		if (err) {
			callback(err,db);
			db.close();
			return;
		};

		var cursor = db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort);
		cursor.each(function(err,doc){
			if (err) {
				callback(err,null);
			};
			if (doc != null) {
				result.push(doc);
			}else{
				callback(null,result);
			}
		})
})
}
exports.deleteMany = function(collectionName,json,callback){
	_connectDB(function(err,db){
		db.collection(collectionName).deleteMany(
			json,
			function(err,result){
				callback(err,result);
				db.close();
			}
		)
	})
}
exports.updataMany = function(collectionName,json1,json2,callback){
	_connectDB(function(err,db){
		db.collection(collectionName).updateMany(
			json1,
			json2,
			function(err,results){
				callback(err,results);
				db.close();
			})
	})
}

exports.getAllCount = function(collectionName,callback){
	_connectDB(function(err,db){
		db.collection(collectionName).count({}).then(function(count){
			callback(count);
			db.close();
		})	
	})
}
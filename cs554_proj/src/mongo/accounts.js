const mongoCollections = require("./collection");
const accounts = mongoCollections.accounts;
const bcrypt = require("bcryptjs");
const gm = require("gm").subClass({imageMagick: true});

const create = async function create(username, password){
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(password == undefined){
		throw new Error("password is not defined");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}
	if(typeof(password) !== "string"){
		throw new Error("password is not of type string");
	}

	let hashPassword = await bcrypt.hash(password, 16);

	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists !== null){
		throw new Error("username has been taken");
		return;
	}

	var newAccount = {
		"username": username,
		"password": hashPassword,
		"score": 0,
		"friends": [],
		"profilePic": 'default.jpg'
	}

	var insert = await accountsCollection.insertOne(newAccount);
	if(insert.insertedCount == 0)
		throw new Error("account cannot be created")
	var insertId = insert.insertedId;
	var account = await accountsCollection.findOne({_id: insertId});
	return account;
}

const createFromGoogleLogin = async function createFromGoogleLogin(username){
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}

	//let hashPassword = await bcrypt.hash(password, 16);

	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists !== null){
		throw new Error("username has been taken");
		return;
	}

	var newAccount = {
		"username": username,
		"password": "",
		"score": 0,
		"friends": [],
		"profilePic": 'default.jpg'
	}

	var insert = await accountsCollection.insertOne(newAccount);
	if(insert.insertedCount == 0)
		throw new Error("account cannot be created")
	var insertId = insert.insertedId;
	var account = await accountsCollection.findOne({_id: insertId});
	return account;
}


const login = async function login(username, password){
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(password == undefined){
		throw new Error("password is not defined");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}
	if(typeof(password) !== "string"){
		throw new Error("password is not of type string");
	}
	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists == null){
		throw new Error("no account with that username");
	}
	let hashPassword = await bcrypt.hash(password, 16);
	if(await bcrypt.compare(password, usernameExists.password) == false){
		throw new Error("password is incorrect");
	}
	return usernameExists;

}

const get = async function get(username){
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}
	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists == null){
		throw new Error("no account with that username");
	}
	return usernameExists;
}

const getSearch = async function getAll(term){
	
	var accountsCollection = await accounts();
	//console.log(term)
	let users = await accountsCollection.find({"username" : {$regex : ".*" + term+ ".*"}}).toArray();
	//console.log(users)
	return users;
}

const changeUsername = async function changeUsername(old, newuser, password){
	if(old == undefined){
		throw new Error("old username is not defined");
	}
	if(password == undefined){
		throw new Error("password is not defined");
	}
	if(newuser == undefined){
		throw new Error("new username is not defined");
	}
	if(typeof(old) !== "string"){
		throw new Error("old username is not of type string");
	}
	if(typeof(newuser) !== "string"){
		throw new Error("new username is not of type string");
	}
	if(typeof(password) !== "string"){
		throw new Error("password is not of type string");
	}
	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: old});
	if(usernameExists == null){
		throw new Error("no account with that username");
		return;
	}
	if(await bcrypt.compare(password, usernameExists.password) == false){
		throw new Error("password is incorrect");
		return;
	}
	let usernameTaken = await accountsCollection.findOne({username: newuser});
	if(usernameTaken){
		throw new Error("that username has already been taken");
		return;
	}
	let updated = await accountsCollection.updateOne({_id: usernameExists._id}, {$set:{username: newuser, password: usernameExists.password, score: usernameExists.score, friends: usernameExists.friends, profilePic: usernameExists.profilePic}});
	if(updated.modifiedCount == 0){
		throw new Error("could not update username");
	}
	return await get(newuser);
}

const changePassword = async function changePassword(old, newpass, username){
	console.log("changing password")
	if(old == undefined){
		throw new Error("old password is not defined");
	}
	if(newpass == undefined){
		throw new Error("new password is not defined");
	}
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(typeof(old) !== "string"){
		throw new Error("old password is not of type string");
	}
	if(typeof(newpass) !== "string"){
		throw new Error("new password is not of type string");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}
	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists == null){
		throw new Error("no account with that username");
		return;
	}
	if(await bcrypt.compare(old, usernameExists.password) == false){
		throw new Error("password is incorrect");
		return;
	}
	let hashPassword = await bcrypt.hash(newpass, 16);
	let updated = await accountsCollection.updateOne({_id: usernameExists._id}, {$set:{username: usernameExists.username, password: hashPassword, score: usernameExists.score, friends: usernameExists.friends, profilePic: usernameExists.profilePic}});
	if(updated.modifiedCount == 0){
		throw new Error("could not update password");
	}
	return await get(username);
}

const addFriend = async function addFriend(username, friend){
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(friend == undefined){
		throw new Error("password is not defined");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}
	if(typeof(friend) !== "string"){
		throw new Error("friend is not of type string");
	}
	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists == null){
		throw new Error("no account with that username");
		return;
	}
	let friendExists = await accountsCollection.findOne({username: friend});
	if(friendExists == null){
		throw new Error("cannot add friend: no account with that username");
		return;
	}
	let addedFriend = usernameExists.friends;
	addedFriend.push(friend);
	let updated = await accountsCollection.updateOne({_id: usernameExists._id}, {$set:{username: usernameExists.username, password: usernameExists.password, score: usernameExists.score, friends: addedFriend, profilePic: usernameExists.profilePic}});
	if(updated.modifiedCount == 0){
		throw new Error("could not update password");
	}
	return await get(username);
}


const removeFriend = async function removeFriend(username, friend){
	
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(friend == undefined){
		throw new Error("password is not defined");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}
	if(typeof(friend) !== "string"){
		throw new Error("friend is not of type string");
	}
	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists == null){
		throw new Error("no account with that username");
		return;
	}
	let friendExists = await accountsCollection.findOne({username: friend});
	if(friendExists == null){
		throw new Error("cannot add friend: no account with that username");
		return;
	}
	let f = usernameExists.friends;
	f = f.filter(e => e !== friend); 
	let updated = await accountsCollection.updateOne({_id: usernameExists._id}, {$set:{username: usernameExists.username, password: usernameExists.password, score: usernameExists.score, itemsInventory: usernameExists.itemsInventory, friends: f}});
	if(updated.modifiedCount == 0){
		throw new Error("could not update password");
	}
	return await get(username);
}

const updateScore = async function updateScore(username, score){
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}
	if(score == undefined){
		throw new Error("score is not defined");
	}
	score = Number(score);
	if(isNaN(score)){
		throw new Error("score is not of type number");
	}
	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists == null){
		throw new Error("no account with that username");
		return;
	}
	let updated = await accountsCollection.updateOne({_id: usernameExists._id}, {$set:{username: usernameExists.username, password: usernameExists.password, score: score, friends: usernameExists.friends, profilePic: usernameExists.profilePic}});
	if(updated.modifiedCount == 0){
		throw new Error("could not update score");
	}
	return await get(username);

}

/* const getPhoto = async function getPhoto(username){
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}
	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists == null){
		throw new Error("no account with that username");
	}
	gm(usernameExists.profilePic)
		.resize(100,100)
		.write('../../public/image/pfp/'+username+'.jpg',function(err){
			if(err) console.log(err)
			console.log("conversion completed")
		})
	return "../../public/image/pfp/"+username+".jpg";	
}
 */
const uploadNewPhoto = async function uploadNewPhoto(username, newPhoto){
	if(username == undefined){
		throw new Error("username is not defined");
	}
	if(typeof(username) !== "string"){
		throw new Error("username is not of type string");
	}
	if(newPhoto == undefined){
		throw new Error("new profile photo is not defined");
	}
	if(typeof(newPhoto) !== "string"){
		throw new Error("new profile photo is not of type string");
	}
	var accountsCollection = await accounts();
	let usernameExists = await accountsCollection.findOne({username: username});
	if(usernameExists == null){
		throw new Error("no account with that username");
	}
	//im.identify(newPhoto);
	//console.log(process.cwd());
	let changeThis = process.cwd()+"/public/images/"+newPhoto;
	let newPhotoURL = username+".jpg"
	gm(changeThis)//This doesn't work for some reason
	.resize(100,100)
	.write(process.cwd()+"/public/images/"+newPhotoURL,function(err){
		if(err) console.log(err)
		console.log("conversion completed")
	}) 
	let updated = await accountsCollection.updateOne({_id: usernameExists._id}, {$set:{username: usernameExists.username, password: usernameExists.password, score: usernameExists.score, friends: usernameExists.friends, profilePic: newPhotoURL}});
	if(updated.modifiedCount == 0){
		throw new Error("could not update profile photo");
	}
	return await get(username);
}

module.exports = {create, createFromGoogleLogin, get, getSearch, login, changeUsername, changePassword, addFriend, removeFriend, updateScore, uploadNewPhoto};

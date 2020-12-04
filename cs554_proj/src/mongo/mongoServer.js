const accounts = require("./accounts")
const express = require("express");
const app = express();

app.use(express.json())
//in the essence of time, these mongo routes are just wrappers and don't do
//much error checking, they expect things to be well formed
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader( "Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    next();
  });

app.post("/api/create", async (req, res) => {
    var acc= {"formatting issue" :"your json was bad!"};
    try{
        //if no password, assume its a google login      
        const body = req.body;
        if(body.username && body.password){
            console.log("creating non google")
             acc = await accounts.create(body.username, body.password);
        }
        else if(body.username)  acc = await accounts.createFromGoogleLogin(body.username);
    }
    catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }
    return res.json(acc)
    
});

app.post("/api/login", async (req, res) => {
    var acc={"formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username && body.password){
            console.log("logging in")
             acc = await accounts.login(body.username,body.password)
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }

    return res.json(acc)
})

app.post("/api/get", async (req,res) => {
    var acc = {"formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username){
             acc = await accounts.get(body.username)
             //console.log(acc)
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }

    return res.json(acc)
})

app.post("/api/getSearch", async (req,res) => {
    var acc = {};
    try{
        const body = req.body;
        if(body.searchTerm) acc = await accounts.getSearch(body.searchTerm)           
        
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }

    return res.json(acc)
})


app.post("/api/changeUsername", async (req,res) => {
    var acc ={"formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username && body.newUsername && body.password){
             acc = await accounts.changeUsername(body.username,body.newUsername,body.password)
             console.log(acc)
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }

    return res.json(acc)
})

app.post("/api/changePassword", async (req,res) => {
    var acc ={"formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username && body.newPassword && body.password){
             acc = await accounts.changePassword(body.password,body.newPassword,body.username)
             console.log(acc)
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }

    return res.json(acc)
})

app.post("/api/addFriend", async (req,res) => {
    var acc ={"formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username && body.friendName){
             acc = await accounts.addFriend(body.username,body.friendName)
             console.log(acc)
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }

    return res.json(acc)
})

app.post("/api/removeFriend", async (req,res) => {
    var acc ={"Formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username && body.friendName){
             
             acc = await accounts.removeFriend(body.username,body.friendName)
            
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }

    return res.json(acc)
})

app.post("/api/save", async (req,res) => {
    var acc ={"Formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username && body.score){        
             acc = await accounts.updateScore(body.username,body.score)
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }

    return res.json(acc)
})

app.post("/api/updateScore", async(req,res) =>{
    var acc ={"Formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username && body.score){
             acc = await accounts.updateScore(body.username,body.score)
             console.log(acc)
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }
    return res.json(acc)
})

// @route GET /
// @desc Loads form
/* app.get("/api/getPhoto", async function (req,res){
  var acc ={"Formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username){
             acc = await accounts.getPhoto(body.username);
             //console.log(acc)
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }
    return res.json(acc)
}) */

app.post('/api/uploadNewPhoto', async (req, res) => {
  var acc ={"Formatting issue" :"your json was bad!"};
    try{
        const body = req.body;
        if(body.username){
             acc = await accounts.uploadNewPhoto(body.username, body.newPhoto);
        }
    }catch(e){
        console.log(e)
        return res.status(400).json({error: e})
    }
    return res.json(acc)
});

app.get("/*", async (req,res) => {
    return res.status(404).json({error: "nice try kiddo"})
});

app.listen(3001, () => {
    console.log("Mongo Server Going Up");
    console.log("Your routes will be running on http://localhost:3001");
  });
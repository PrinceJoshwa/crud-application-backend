const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const fs = require("fs")

const app = express();
app.use(express.json());
const port = 8000;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    })
);

// Display All Users
app.get("/users", (req, res) => {
    return res.json(users);
});

//Delete User Details
app.delete("/users/:id", (req,res) => {
    let id = Number(req.params.id);
    let filteredUsers=users.filter((user)=>user.id !== id);
    fs.writeFile("./sample.json",JSON.stringify(filteredUsers),(err,data)=>{
        return res.json(filteredUsers);
    });
});

//Add New User
app.post("/users",(req, res) => {
    let { name, age, profession} = req.body;
    if(!name || !age || !profession){
        res.status(400).send({message: "All Fields Required"})
    }
    let id = Date.now();
    users.push({id, name, age, profession});
    fs.writeFile("./sample.json",JSON.stringify(filteredUsers),(err,data)=>{
    return res.json({"message": "User Details Added Successfully"});
    });
});

//Update User
app.patch("/users/:id",(req, res) => {
    let id = Number(req.params.id);
    let { name, age, profession} = req.body;
    if(!name || !age || !profession){
        res.status(400).send({message: "All Fields Required"})
    }
    
    let index = users.findIndex((user) => user.id == id);

    users.splice(index,1, {...req.body});

    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
    return res.json({"message": "User Details Updated!"});
    });
});


app.listen(port, (err) => {
    if (err) {
        console.error("Server failed to start:", err);
    } else {
        console.log(`App is running on port ${port}`);
    }
});

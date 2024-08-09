const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
const port = 8000;

app.use(
    cors({
        origin: "https://crud-application-f7.vercel.app", // Updated URL
        methods: ["GET", "POST", "PATCH", "DELETE"],
    })
);

// Display All Users
app.get("/users", (req, res) => {
    return res.json(users);
});

// Delete User Details
app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err) => {
        if (err) {
            return res.status(500).send({ message: "Error deleting user" });
        }
        return res.json(filteredUsers);
    });
});

// Add New User
app.post("/users", (req, res) => {
    let { name, age, profession } = req.body;
    if (!name || !age || !profession) {
        return res.status(400).send({ message: "All Fields Required" });
    }
    let id = Date.now();
    users.push({ id, name, age, profession });
    fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).send({ message: "Error adding user" });
        }
        return res.json({ message: "User Details Added Successfully" });
    });
});

// Update User
app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, profession } = req.body;
    if (!name || !age || !profession) {
        return res.status(400).send({ message: "All Fields Required" });
    }
    let index = users.findIndex((user) => user.id == id);
    if (index !== -1) {
        users[index] = { ...req.body, id }; // Keep the same ID
        fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).send({ message: "Error updating user" });
            }
            return res.json({ message: "User Details Updated!" });
        });
    } else {
        return res.status(404).send({ message: "User not found" });
    }
});

app.listen(port, (err) => {
    if (err) {
        console.error("Server failed to start:", err);
    } else {
        console.log(`App is running on port ${port}`);
    }
});

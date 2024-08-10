const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Load sample data
const usersFilePath = path.join(__dirname, "sample.json");
let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

const app = express();
app.use(express.json());
const port = process.env.PORT || 8000; // Use PORT from .env or default to 8000

// app.use(
//     cors({
//         origin: "*", // Frontend URL
//         methods: ["GET", "POST", "PATCH", "DELETE"],
//     })
// );

app.use(cors());

// Display All Users
app.get("/users", (req, res) => {
    res.json(users);
});

// Delete User Details
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    users = users.filter((user) => user.id !== id);
    fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send({ message: "Error deleting user" });
        }
        res.json(users);
    });
});

// Add New User
app.post("/users", (req, res) => {
    const { name, age, profession } = req.body;
    if (!name || !age || !profession) {
        return res.status(400).send({ message: "All Fields Required" });
    }
    const id = Date.now();
    const newUser = { id, name, age, profession };
    users.push(newUser);
    fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send({ message: "Error adding user" });
        }
        res.json({ message: "User Details Added Successfully" });
    });
});

// Update User
app.patch("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, age, profession } = req.body;
    if (!name || !age || !profession) {
        return res.status(400).send({ message: "All Fields Required" });
    }
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        users[index] = { ...req.body, id };
        fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send({ message: "Error updating user" });
            }
            res.json({ message: "User Details Updated!" });
        });
    } else {
        res.status(404).send({ message: "User not found" });
    }
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

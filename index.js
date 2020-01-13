// implement your API here
// type: npm i express <------- to install the express library
// add the index.js file with code into the root folder
// to run the server type: npm run server <----- this is the command to run server
// make a GET reuqest to localhost: 8000 using Postman or Insomnia
// to solve the sqlite3 error just do npm i sqlite3

const express = require('express');

const db = require("./data/db.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send({api: "Up and Running"})
})


// Users 
server.get("/api/users", (req, res) => {
    db.find()
      .then(users => {
          res.status(200).json(users);
      })
      .catch(err => {
          console.log("error on GET /api/users", err);
          res
            .status(500)
            .json({errorMessage: "error getting list of users from the database"})
      })
})


// users with ID
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(user => {
        if (!user) {
            res
            .status(404)
            .json({message: "The user with this specific ID does not exist"})
        } else {
            res.status(200).json(user);
        }
    })
    .catch(err => {
        console.log("error on GET /api/users/:id", err);
        res
        .status(500)
        .json({errorMessage: "The user information could not be retrieved"})
    })
})

server.post("/api/users", (req, res) => {
    const userData = req.body;

    if (!userData.name || !userData.bio) {
        res.status(400).json({error: "Please provide name and bio for the user"})
    }

    db.insert(userData)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        console.log("error on POST /api/users", err);
        res.status(500).json({
            error: "There was an error while saving the user to the DataBase"
        })
    })
})

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;

    db.remove(id)
    .then(removed => {
        if (!removed) {
            res
            .status(404)
            .json({message: "The user with this specific ID does not exist."})
        } else {
            res.status(200).json({message: "USER was removed successfully", removed})
        }
    })
    .catch(err => {
        console.log("error on DELETE /api/users/:id", err);
        res.status(500).json({error: "The user could not be removed"});
    })
})

server.put("api/users/:id", (req, res) => {
    const id = req.params.id;
    const userData = req.body;

    if (!userData.name || !userData.bio) {
        res
        .status(400)
        .json({errorMessage: "Please provide name and bio for the user."})
    }

    db.update(id, userData)
    .then(updated => {
        if (!updated) {
            res
            .status(404)
            .json({message: "The user with this specific ID does not exist"})
        } else {
            res.status(200).json({message: "User updated successfully", updated})
        }
    })
    .catch(err => {
        console.log("error on PUT /api/users/:id", err);
        res.status(500).json({errorMessage: "error updating user"})
    });
});

const port = 8000;

server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`))
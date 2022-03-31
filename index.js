const express = require("express");
const customerData = require("./data/customers");
const flowerData = require("./data/flowers");
const quizData = require("./data/data");
const scoreData = require("./data/scores");
let customers = customerData.customers;
let flowers = flowerData.flowers;
let quizzes = quizData.quizzes;
let scores = scoreData.scores;

const app = express();
app.use(express.json());

app.post("/register", (req, res) => {
    let customer = customers.find((c) => c.email === req.body.email);
    if (!customer) {
        customer = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        };
        customers.push(customer);
        res.send({ done: true, message: "Account registered successfully." });
    } else {
        res.status(403).send({ done: false, message: "Email already exists." });
    }
});

app.post("/login", (req, res) => {
    let customer = customers.find((c) => c.email === req.body.email);
    if (!customer) {
        res.send({ done: false, message: "Email does not exist." });
    } else if (customer && customer.password !== req.body.password) {
        res.send({ done: false, message: "Password incorrect." });
    } else {
        res.send({ done: true, message: "Credentials valid." });
    }
});

app.get("/flowers", (req, res) => {
    res.send({
        done: true,
        result: flowers,
        message: "Flower data retrieved successfully",
    });
});

app.get("/quiz/:id", (req, res) => {
    console.log(req.params.id);
    let quiz = quizzes.find((q) => q.id === parseInt(req.params.id));
    if (quiz) {
        res.send({
            done: true,
            result: quiz,
            message: "Quiz retrieved successfully.",
        });
    } else {
        res.send({
            done: false,
            result: undefined,
            message: `No quiz with id ${req.params.id} found.`,
        });
    }
});

app.post("/score", (req, res) => {
    const score = {
        quizTaker: req.body.quizTaker,
        quizName: req.body.quizName,
        score: req.body.score,
    };
    scores.push(score);
    res.send({ done: true, message: "Score posted successfully" });
});

app.get("/scores/:quiztaker/:quizname", (req, res) => {
    let userScores = [];
    for (let score of scores) {
        if (
            score.quizTaker === req.params.quiztaker &&
            score.quizName === req.params.quizname
        ) {
            userScores.push(score.score);
        }
    }
    if (userScores.length > 0) {
        res.send({
            done: true,
            result: userScores,
            message: "Found scores sucessfully.",
        });
    }
    res.status(404).send({
        done: false,
        result: [],
        message: "No score found.",
    });
});

app.listen(3000, () => console.log("Listening on port 3000"));

const express = require("express");
const cors = require("cors");
const { customers } = require("./data-access/data/customers");
const { flowers } = require("./data-access/data/flowers");
const { quizzes } = require("./data-access/data/data");
const { scores } = require("./data-access/data/scores");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ done: true, message: "Fine!" });
});

app.post("/register", (req, res) => {
    let customer = customers.find((c) => c.email === req.body.email);
    if (!customer) {
        customer = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        };
        customers.push(customer);
        res.status(200).json({
            done: true,
            message: "Account registered successfully.",
        });
    } else {
        res.status(403).json({ done: false, message: "Email already exists." });
    }
});

app.post("/login", (req, res) => {
    let customer = customers.find((c) => c.email === req.body.email);
    if (!customer) {
        res.status(200).json({ done: false, message: "Email does not exist." });
    } else if (customer && customer.password !== req.body.password) {
        res.status(200).json({ done: false, message: "Password incorrect." });
    } else {
        res.status(200).json({ done: true, message: "Credentials valid." });
    }
});

app.get("/flowers", (req, res) => {
    res.status(200).json({
        done: true,
        result: flowers,
        message: "Flower data retrieved successfully",
    });
});

app.get("/quiz/:id", (req, res) => {
    console.log(req.params.id);
    let quiz = quizzes.find((q) => q.id === parseInt(req.params.id));
    if (quiz) {
        res.status(200).json({
            done: true,
            result: quiz,
            message: "Quiz retrieved successfully.",
        });
    } else {
        res.status(200).json({
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
    res.status(200).json({ done: true, message: "Score posted successfully" });
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
        res.status(200).json({
            done: true,
            result: userScores,
            message: "Found scores sucessfully.",
        });
    }
    res.status(404).json({
        done: false,
        result: [],
        message: "No score found.",
    });
});

app.listen(port, () => console.log(`Listening on port ${port}.`));

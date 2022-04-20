const express = require("express");
const bcrypt = require("bcrypt");
const { store } = require("./data-access/db");
var cors = require("cors");

// Creates the express server.
const application = express();

// Middlewares process the requests before they get sent to our request handlers
// Initialize them here
application.use(cors());
application.use(express.json());

// Setting up request handlers for various api calls
application.post("/register", (req, res) => {
    /*
     * POST method that stores the name, email and password of the quiz taker.
     * If a customer with the same email already exists, return a response with
     * the status code 403. The method should return an object {done, message}
     * where done is boolean and message is a string;
     */
    store
        .addCustomer(req.body.name, req.body.email, req.body.password)
        .then((x) => {
            res.status(200).json({
                done: true,
                message: "Account created successfully.",
            });
        })
        .catch((e) => {
            console.log(e);
            res.status(400).json({
                done: false,
                message: "The customer was not added due to an error.",
            });
        });
});

application.post("/login", (req, res) => {
    /*
     * POST method that determinse whether the provided credentials
     * (email, password) are valid or not. The method should return an object
     * {done, message}.
     */
    store
        .login(req.body.email, req.body.password)
        .then((x) => {
            if (x.rows.length === 1) {
                let user = x.rows[0];
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    res.status(200).json({
                        done: true,
                    });
                } else {
                    res.status(400).json({
                        done: false,
                        message: "Invalid credentials.",
                    });
                }
            } else {
                res.status(400).json({
                    done: false,
                    message: "The specified email could not be found.",
                });
            }
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({
                done: false,
                message: "The credientials could not be validated due to an error.",
            });
        });
});

application.post("/score", (req, res) => {
    /*
     * POST method storing the score for a quiz taken by a quiz taker. The method
     * sends an object {quizTaker, quizName, score}. The method should return an
     * object {done, message}.
     */
    res.status(400).json({
        done: false,
        message: "This method is not implemented yet.",
    });
});

application.get("/flowers", (req, res) => {
    /*
     * GET method returning the list of all the flowers. The method should return
     * an object {done, result, message} where result is an array.
     */
    store
        .getFlowers()
        .then((x) => {
            res.status(200).json({ done: true, result: x.rows });
        })
        .catch((e) => {
            res.status(500).json({
                done: false,
                result: [],
                message: "The data could not be retrieved due to an error.",
            });
        });
});

application.get("/quiz/:id", (req, res) => {
    /*
     * GET method returning the specified quiz. The method should return an object
     * {done, result, message} where result is an object or it is undefined.
     */

    store
        .getQuiz(req.params.id)
        .then((x) => {
            if (x.rows.length == 1) {
                res.status(200).json({ done: true, result: x.rows[0] });
            } else {
                res.status(400).json({
                    done: false,
                    result: undefined,
                    message: "Could not find a quiz for that user.",
                });
            }
        })
        .catch((e) => {
            res.status(500).json({
                done: false,
                result: [],
                message: "The data could not be retrieved due to an error.",
            });
        });
});

application.get("/scores/:quiztaker/:quizname", (req, res) => {
    /*
     * GET method returning the scores of the specified quiz taker for the
     * specified quiz. The method should return an object {done, results, message}
     * where results is an array or it is undefined.
     */
    store
        .getScore(req.params.quiztaker, req.params.quizname)
        .then((x) => {
            if (x.rows.length > 0) {
                res.status(200).json({ done: true, result: x.rows });
            } else {
                res.status(400).json({ done: false, message: "No scores found." });
            }
        })
        .catch((e) => {
            res.status(500).json({
                done: false,
                result: [],
                message: "The data could not be retrieved due to an error.",
            });
        });
});

application.get("/", (req, res) => {
    /*
     * GET method returning a server status message. The method should return an
     * object {status, message}
     */
    res.status(200).json({
        done: true,
        message: "Connected to the imagequiz api",
    });
});

// Determines which port to listen to.
const PORT = process.env.PORT || 3000;

// Starts the express server and runs a callback function when startup finishes
application.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

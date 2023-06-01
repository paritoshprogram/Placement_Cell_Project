var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const db = require('../config/connection').db


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  const secretKey = "secretkey"



module.exports.register = (req, res) => {

    const { username, password} = req.body;

    const q = 'SELECT * FROM auth WHERE username = ?'

    db.query(q, [username], (err, result) => {

        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Something went wrong"
            })
        }

        if (result.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {

            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: "Something went wrong"
                })
            }

            const q = 'INSERT INTO auth (username, password) VALUES (?, ?)'

            db.query(q, [username, hashedPassword], (err, result) => {

                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: "Something went wrong"
                    })
                }

                return res.status(200).json({
                    message: "User registered successfully"
                })

            })

        })

    })

}


module.exports.login = (req, res, next) => {

    const { username, password } = req.body;

    const q = 'SELECT * FROM auth WHERE username = ?'

    db.query(q, [username], (err, result) => {

        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Something went wrong"
            })
        }

        if (result.length == 0) {
            return res.status(400).json({
                message: "User does not exists"
            })
        }

        bcrypt.compare(password, result[0].password, (err, isMatched) => {

            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: "Something went wrong"
                })
            }

            if (isMatched) {

                const payload = {
                    id: result[0].id,
                    username: result[0].username
                }

                jwt.sign(payload, secretKey, (err, token) => {

                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            message: "Something went wrong"
                        })
                    }

                    localStorage.setItem('token', token)

                    next();

                })

            } else {
                return res.status(400).json({
                    message: "Password is incorrect"
                })
            }

        })

    })
}

module.exports.checkAuth = (req, res, next) => {

    const token = localStorage.getItem('token')

    if (!token) {
        return res.status(400).json({
            message: "User not logged in"
        })
    }

     jwt.verify(token, secretKey, (err, payload) => {

        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Something went wrong"
            })
        }

        req.user = payload

        console.log(payload)

        next();
    })
 

}


module.exports.logout = (req, res) => {

    localStorage.removeItem('token')
    res.redirect(200,'/users/login')
}


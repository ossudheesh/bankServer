const jwt = require('jsonwebtoken')
const db = require('./db')

database = {
    1000: { acno: 1000, uname: "abin", password: 1000, balance: 5000, transaction: [] },
    1001: { acno: 1001, uname: "anu", password: 1001, balance: 4000, transaction: [] },
    1002: { acno: 1002, uname: "jith", password: 1002, balance: 3000, transaction: [] },
}
var currentUser
var currentAccNo
var currentBalance = 0


const register = (uname, acno, password) => {
    return db.User.findOne({ acno })
        .then(user => {
            if (user) {
                return {
                    statusCode: 401,
                    status: false,
                    message: 'Account already exists'
                }
            }
            else {
                const newUser = new db.User({
                    acno,
                    uname,
                    password,
                    balance: 0,
                    transaction: []
                })
                newUser.save()

                return {
                    statusCode: 200,
                    status: true,
                    message: 'Successfully registered'
                }
            }
        })
}
const login = (acno, password) => {
    return db.User.findOne({ acno })
        .then(user => {
            if (user) {
                if (user.password == password) {
                    currentUser = user.uname
                    currentAccNo = acno
                    // generate token 
                    const token = jwt.sign({
                        currentAccNo: acno
                    }, 'secretkey123')
                    return {
                        statusCode: 200,
                        status: true,
                        message: 'Login Successful',
                        token,
                        currentAccNo,
                        currentUser
                    }
                }
                else {
                    return {
                        statusCode: 401,
                        status: false,
                        message: 'Invalid credentials'
                    }
                }
            }
            else {
                return {
                    statusCode: 401,
                    status: false,
                    message: 'Invalid credentials'
                }
            }

        })


}
const deposit = (acno, pwd, amount) => {
    var amount = parseInt(amount)
    return db.User.findOne({ acno })
        .then(user => {
            if (user.password == pwd) {
                user.balance += amount
                currentBalance = user.balance
                user.transaction.push({
                    type: "CREDIT",
                    amount: amount
                })
                user.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: amount + ' credited on ' + acno + ', Balance:' + currentBalance
                }
            }

            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'Invalid Credentials'
                }
            }


        })
}
const withdraw = (req, acno, pwd, amount) => {

    var amount = parseInt(amount)
    return db.User.findOne({ acno })
        .then(user => {
            if (req.currentAccNo != acno) {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'Operation Denied'
                }
            }
            if (user.password == pwd) {
                if (user.balance >= amount) {
                    user.balance -= amount
                    currentBalance = user.balance
                    user.transaction.push({
                        type: "DEBIT",
                        amount: amount
                    })
                    user.save()
                    return {
                        statusCode: 200,
                        status: true,
                        message: amount + ' is withdrew from ' + acno + ' , Balance:' + currentBalance
                    }
                }
                else {
                    return {
                        statusCode: 422,
                        status: false,
                        message: 'Insufficient Balance'
                    }

                }

            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'Invalid Credentials'
                }
            }
        })
}
const transaction = (acno) => {
    return db.User.findOne({ acno })
        .then(user => {
            if (user) {
                return {
                    statusCode: 200,
                    status: true,
                    message: user.transaction
                }
            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'User not found'
                }
            }
        })
}
const deleteAcc = (acno) => {
    return db.User.deleteOne({ acno })
        .then(user => {
            if (!user) {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'User not found'
                }
            }
            else {
                return {
                    statusCode: 200,
                    status: true,
                    message: 'user deleted successfully'
                }
            }
        })
}

module.exports = {
    register,
    login,
    deposit,
    withdraw,
    transaction,
    deleteAcc
}
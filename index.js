const express = require('express')          //importing express
const dataService = require('./services/data.service')
const jwt = require('jsonwebtoken')
const cors=require('cors')


const app = express()                       //server app created

app.use(cors({
    origin:'http://localhost:4200'
}))
app.use(express.json())                     //to parse json

const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        const data = jwt.verify(token, 'secretkey123')
        req.currentAccNo = data.currentAccNo
        next()
    } catch {
        res.status(401).json({
            status: false,
            message: "Please Login"
        })
    }
}
const logMiddleware = (req, res, next) => {     //Application middleware
    next()
}

app.use(logMiddleware)

app.get('/', (req, res) => {                    //API call resolving - GET method(to read data)
    res.send("Get Worked ")
})
app.post('/', (req, res) => {                    //API call resolving - POST method(to create data)
    res.send("POST Worked ")
})
app.put('/', (req, res) => {                    //API call resolving - PUT method(to update entire data)
    res.send("PUT Worked ")
})
app.patch('/', (req, res) => {                    //API call resolving - PATCH method(to update data partially)
    res.send("Patch Worked ")
})
app.delete('/', (req, res) => {                    //API call resolving - DELETE method(to delete data)
    res.send("DELETE Worked ")
})

// Register api 
app.post('/register', (req, res) => {
    dataService.register(req.body.uname, req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})
// Login api 
app.post('/login', (req, res) => {
    dataService.login(req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/deposit', jwtMiddleware, (req, res) => {
    dataService.deposit(req.body.acno, req.body.password, req.body.amount)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/withdraw', jwtMiddleware, (req, res) => {
    dataService.withdraw(req, req.body.acno, req.body.password, req.body.amount)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/transaction', jwtMiddleware,(req, res) => {
    dataService.transaction(req.body.acno)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
})
app.delete('/onDelete/:acno', jwtMiddleware,(req, res) => {
    dataService.deleteAcc(req.params.acno)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
})

app.listen(3000, () => {                        // set a port to run server and console a msg
    console.log('server started on 3000');
})
const mongoose=require('mongoose')

// connection 
mongoose.connect('mongodb://localhost:27017/bankServer',{
    useNewUrlParser:true
    }
)

// schema 
const User=mongoose.model('User',{
    acno:Number,
    uname:String,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}
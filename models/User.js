
const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    fullName:{type:String,unique:true,required:true},
    username:{type:String,unique: true,required:true},
    email:    { type: String, unique: true, required: true },
    password: { type: String, required: true },
})

module.exports=mongoose.model('User',userSchema)
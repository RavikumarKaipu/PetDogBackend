require('dotenv').config();
const express=require('express')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const cors=require('cors')


const app=express()
const PORT = process.env.PORT || 7000;
const SECRET_KEY=process.env.SECRET_KEY;


app.use(cors())
app.use(express.json())

const User = require('./models/User');


mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once('open',()=>console.log('MongoDB Connected'));
mongoose.connection.on('error',(err)=>console.log('MongoDB error ',err));

app.get('/',(req,res)=>res.json({status:'ok',time:new Date().toLocaleTimeString()}))

app.listen(PORT,()=>{
    console.log(`server runs at http://localhost:${PORT}`)
})


app.post('/api/signup',async (req,res)=>{
    const {fullName,username,email,password}=req.body
    if(!fullName||!username || !email || !password ){
        return res.status(400).json({error:'All fields required'})

    }   
    try{
        const user=await User.findOne({$or:[{username},{email}]})
        if(user){
            return res.status(400).json({error:'Username or Email already exist!'});
        }
        const hashed=await bcrypt.hash(password,10);
        await new User({fullName,username,email,password:hashed}).save();
        res.status(201).json({message:'User registered successfully '})

    }catch(err){
        console.error(err); res.status(500).json({ error: 'Server error on signup' });

    }
})


app.post('/api/login',async (req,res)=>{
    const {username,password}=req.body
try{
    const user=await User.findOne({username});
    if(!user){
        return req.status(401).json({error:'Invalid Credentials'})
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({error:'Invalid Credentials'})
    }
    const token=jwt.sign({id:user._id,username:user.username},SECRET_KEY,{expiresIn:'1d'})
    res.status(200).json({token,username:user.username,email:user.email})
}catch(err){
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
}
})
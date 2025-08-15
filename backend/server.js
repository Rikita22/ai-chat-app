const express=require('express');
const mongoose=require('mongoose');
const cors =require('cors');
const bodyparser=require('body-parser');
require('dotenv').config();

const app =express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
        .then(()=>console.log('MOngoDB Connected'))
        .catch((err)=>console.log(err));

const chatRoute = require('./routes/chat');
app.use('/api',chatRoute);        

app.get('/',(req,res)=>{res.send('Server is running')});

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
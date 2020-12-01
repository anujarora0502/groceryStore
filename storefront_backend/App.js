const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();

app.use(bodyParser.json());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use((req,res,next)=>{
    
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type,Accept, Authorization');
    res.setHeader("Access-Control-Allow-Methods",'GET,POST,PATCH,DELETE');
    next();
  });
  


app.get("/api/",(req,res,next)=>{
    res.json({message:"Welcome user"});
})

const users = [];

app.post("/api/login",async (req,res)=>{

    const data = req.body;

    const identifiedUser = await User.findOne({email:data.email});

    if(identifiedUser){
        if(identifiedUser.password === data.password){
            res.status(200);
            res.json({userId:identifiedUser.id,email:identifiedUser.email});
        }else{
            res.status(401);
            res.send("Invalid password!"); 
        }
    }else{
        res.status(401);
        res.send("Invalid email");
    }
})

app.post("/api/signup",async (req,res)=>{
     try{
        const {email,phoneNumber,password} = req.body;

        const createUser = new User({
            email,
            phoneNumber,
            password
        })

        await createUser.save();

        const identifiedUser = await User.findOne({email:email});

        res.status(200);
        res.json({userId:identifiedUser.id,email:identifiedUser.email});
     }catch(err){
        res.status(401);
        res.send("Some Error occured");
     }
 
})


app.post("/api/getCartNumber",async (req,res)=>{
     
   const uid = req.body.userId;

   const identifiedUser = await User.findOne({_id:uid});
   if(identifiedUser)
   res.json({quantity:identifiedUser.cart.length});

})

app.post("/api/addtocart",async (req,res)=>{
     
   const {userId,description, price} = req.body;
   
   const identifiedUser = await User.findOne({_id:userId});

   identifiedUser.cart.push({description,price});
   
   try{
   await identifiedUser.save();
     res.send("added to cart successfully")
   }catch(err){
     res.send(err);
   }
})

app.post("/api/getCartItems", async (req,res)=>{

   const {userId} = req.body; 
   
   
   const identifiedUser = await User.findOne({_id:userId});
   
   if(identifiedUser){
   res.json(identifiedUser.cart);
   }

})


app.post("/api/deleteCart",async (req,res)=>{
    const {userId} = req.body;
   
    const identifiedUser = await User.findOne({_id:userId});

    identifiedUser.cart = [];

    await identifiedUser.save();

    res.send("cart is empty");
 
})

app.post("/api/addOrder",async (req,res)=>{
    const {userId,order} = req.body;

    try{

        const identifiedUser = await User.findOne({_id:userId});
        identifiedUser.orders.push(order);     
        await identifiedUser.save();
        res.send("order created")
    }catch(err){
        console.log(err);  
    }

    
})

const port = process.env.PORT || 5000;

mongoose.connect(`mongodb+srv://admin-anuj:anuj0502@cluster0.nzabb.mongodb.net/storefront?retryWrites=true&w=majority`,{useNewUrlParser : true, useUnifiedTopology : true})
.then(()=>{
    app.listen(port,()=>{
        console.log("app is running at port number "+port);
    });
})
.catch(err=>{
    console.log(err);
});
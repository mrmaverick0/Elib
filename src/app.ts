import express from "express";

const app =express();

//! Routes
//? Http methods GET,PUT,PATCH,POST,DELETE
app.get('/',(req,res,next)=>{
    res.json({message:"Welcome to elib apis"});
});

export default app;
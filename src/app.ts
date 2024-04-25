import express, { NextFunction, Request, Response } from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler";

const app =express();

//! Routes
//? Http methods GET,PUT,PATCH,POST,DELETE
app.get('/',(req,res,next)=>{
    
    res.json({message:"Welcome to elib apis"});
});

//todo  Global error handler

app.use(globalErrorHandler);

export default app;
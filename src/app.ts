import express, { NextFunction, Request, Response } from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app =express();

//! Routes
//? Http methods GET,PUT,PATCH,POST,DELETE
app.get('/',(req,res,next)=>{
    
    res.json({message:"Welcome to elib apis"});
});

app.use('/api/users',userRouter);


//todo  Global error handler

app.use(globalErrorHandler);

export default app;
import express, { NextFunction, Request, Response } from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app =express();
app.use(express.json());
//! Routes
//? Http methods GET,PUT,PATCH,POST,DELETE
app.get('/',(req,res,next)=>{
    
    res.json({message:"Welcome to elib apis"});
});

app.use('/api/users',userRouter);
app.use('/api/books',bookRouter);


//todo  Global error handler

app.use(globalErrorHandler);

export default app;
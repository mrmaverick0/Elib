import express from "express";
import createBook from "./bookController";

const bookRouter = express.Router();

//router
bookRouter.post('/register',createBook);
export default bookRouter;
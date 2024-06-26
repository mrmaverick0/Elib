import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //! Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  //* Database call
  // const user = await userModel.findOne({email:email}) //! OR

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User already exits with this email");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "error while getting user"));
  }

  //! password -> hash
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "error while creating user"));
  }

  //! Token generation -> JWT
 try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
        expiresIn: "7d",
      });
      //! Response
      res.status(201).json({ accessToken: token });
 } catch (error) {
    return next(createHttpError(500, "error while signing the jwt"));
 }
};

const loginUser = async (req: Request, res: Response, next: NextFunction)=>{
    const {  email, password } = req.body;
    //! Validation
    if (!email || !password) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }


    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(400, "User not found"));
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return next(createHttpError(400, "Username and password incorrect"));
    }
    
    //!Cretae access Token
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
        expiresIn: "7d",
      });
    res.json({accessToken:token})
} 

export { createUser ,loginUser};

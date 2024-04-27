import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const {title,genre} = req.body;
  console.log("files", req.files);

  const files = req.files as { [filename: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: "book-covers",
    format: coverImageMimeType,
  });

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    bookFileName
  );

  try {
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    console.log("bookFileUploadResult", bookFileUploadResult);
    //! upload cloudinary URL into DB
   // @ts-ignore
    console.log('userId',req.userId);
    
    const newBook = await bookModel.create({
      title,
      genre,
      author: "662a362a6587ebd6be116439",
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);
    res.status(200).json({id:newBook._id});
  } catch (error) {
    console.log(error);
    return next(createHttpError(500,"Error While uploading file"))
  }

  
};
export default createBook;

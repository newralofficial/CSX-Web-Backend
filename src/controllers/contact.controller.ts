import { Request, Response, NextFunction } from "express";
import { Contact } from "../models/contact/contact.modle";
import { ApiError } from "../util/apiError";
import { ResponseStatusCode } from "../constants/constants";
import { ApiResponse } from "../util/apiResponse";
import bigPromise from "../middlewares/bigPromise";



export const createContact = bigPromise(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { firstName, lastName, email, phoneNumber, subject, message } = req.body;
  
        if (!firstName || !email || !subject || !message) {
            return res.status(400).json({ message: 'All required fields must be provided' });
          }
      
  
          const newContact = new Contact({
            firstName,
            lastName,
            email,
            phoneNumber,
            subject,
            message
          });
      
          await newContact.save();
             
  
        res.json(
          new ApiResponse(
            ResponseStatusCode.SUCCESS,
            newContact,
            "Contact Request created successfully!"
          )
        );
      } catch (error) {
        res
          .status(error.statusCode || 500)
          .json(
            new ApiError(
              error.statusCode || ResponseStatusCode.INTERNAL_SERVER_ERROR,
              error.message || "An error occurred while saving contact information"
            )
          );
      }
    }
  );
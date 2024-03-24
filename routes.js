import express, { response }  from "express";
import {Server} from 'socket.io';
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import models from "./models.js";
import JWT from 'jsonwebtoken'; 
import dotenv  from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES = {
  GET:{
    /**
     * Serves the home page.
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    home:(request,response)=>{
      response.sendFile(__dirname+'/public/routes/home/index.html');
    },
    /**
     * Serves the authentication page.
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    authentication:(request,response)=>{
      response.sendFile(__dirname+'/public/routes/authentication/index.html');
    }
  },
  POST:{
    /**
     * Restricts the post
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    home:(request,response)=>{
      response.send('{"message":"only get request"}')
    },
    /**
     * Manages users entry and login
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    authentication:(request,response)=>{
      let Data = {...request.body};
      let Keys = Object.keys(models.UserSchema.paths).filter((fieldName)=>(fieldName !== '_id' && fieldName !== '__v'));
      if(Data.Purpose == 'signup'){
        for(let key in Data){
          if(!Keys.includes(key))
            delete Data[key];
        }
        let Document = new models.UserModel(Data);
        Document.save().then(item=>{
          let SavedData = JSON.parse(JSON.stringify(item));
          delete SavedData['__v'];
          response.cookie("user_token",JWT.sign(SavedData,process.env.SECRET_KEY),{
            httpOnly:true
          });
          response.clearCookie('_id',{httpOnly:true});
          response.send(JSON.stringify(SavedData));
        }).catch(err=>{
          response.status(400).send(JSON.stringify({err_msg:err.message}));
          console.error(err.message);
        });
      }else if(Data.Purpose == 'login'){
        console.log(JWT.verify(request.cookies["user_token"],process.env.SECRET_KEY));
        response.send({...request.cookies["user_token"]});
      }
      
    }
  }
}
export default ROUTES;
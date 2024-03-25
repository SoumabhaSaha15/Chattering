import express from "express";
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
    home:async(request,response)=>{
      response.sendFile(__dirname+'/public/routes/home/index.html');
    },
    /**
     * Serves the authentication page.
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    authentication:async (request,response)=>{
      response.sendFile(__dirname+'/public/routes/authentication/index.html');
    },
    /**
     * Serves the authentication page.
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    chat:async (request,response)=>{
      response.sendFile(__dirname+'/public/routes/chat/index.html');
    }
  },
  POST:{
    /**
     * Restricts the post
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    home:async(request,response)=>{
      response.send('{"message":"only get request"}')
    },
    /**
     * Manages users entry and login
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    authentication:async (request,response)=>{
      /**
       * @param {string} token
       * @returns {string}
       */
      const parseJWT = (token) => (JWT.verify(request.cookies[token],process.env.SECRET_KEY));
      /**
       * @param {string[]} keys
       * @param {object} data
       * @returns {object}
       */
      const filterDataObject = (keys,data) => {
        let newData = {};
        (keys.reduce((accumulator,currunt) => {newData[currunt] = data[currunt]},""));
        return newData;
    };
      let Data = {...request.body};
      let Keys = Object.keys(models.UserSchema.paths).filter((fieldName)=>(fieldName !== '_id' && fieldName !== '__v'));
      if(Data?.Purpose == 'signup'){
        try{  
          let Document = new models.UserModel(filterDataObject(Keys,Data));
          let SavedData = JSON.parse(JSON.stringify(await Document.save()));
          response.cookie("user_token",JWT.sign(SavedData['_id'],process.env.SECRET_KEY),{httpOnly:true});
          response.send(JSON.stringify({'redirect':'./chat'}));
        }catch(err){
          response.status(400).send(JSON.stringify({err_msg:err.message}));
        }  
      }else if(Data?.Purpose == 'login'){
        try{
          let data = await models.UserModel.exists({_id:parseJWT("user_token")})
          let FilteredData = filterDataObject(Keys,JSON.parse(JSON.stringify(await models.UserModel.findOne(data))));
          FilteredData['UserName'] = FilteredData['UserName']?.toUpperCase();
          (JSON.stringify(FilteredData)==JSON.stringify(filterDataObject(Keys,Data)))?
          (response.send(JSON.stringify({'redirect':'./chat'}))):
          (response.send(JSON.stringify({'redirect':'./authentication'})));
        }catch(err){
          response.send(err);
        }
      }
      
    },
    /**
     * Manages users entry and login
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    chat:async(request,response)=>{

    }
  }
}
export default ROUTES;
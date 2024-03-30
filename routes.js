import express from "express";
import {Server} from 'socket.io';
import fs from 'fs';
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import models from "./models.js";
import JWT from 'jsonwebtoken'; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Global from "./global.js";
import { get } from "https";
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
    },
    /**
    * brings to settings page
    * @param {express.Request} request 
    * @param {express.Response} response 
    */
    settings:async (request,response) => {
      response.sendFile(__dirname+'/public/routes/settings/index.html');
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
      let Data = {...request.body};
      let Keys = Object.keys(models.UserSchema.paths).filter((fieldName)=>(fieldName !== '_id' && fieldName !== '__v'));
      if(Data?.Purpose == 'signup'){
        try{  
          let Document = new models.UserModel(Global.setObjectKeys(Keys,Data));
          let SavedData = JSON.parse(JSON.stringify(await Document.save()));
          if(!Global.parseJWT("user_token",request.cookies)){
            response.cookie("user_token",JWT.sign(SavedData['_id'],process.env.SECRET_KEY),{httpOnly:true});
            Global.CreateFolder(SavedData['_id']);
            response.send(JSON.stringify({'redirect':'./chat'}));
          }
          else{
            throw new Error('invalid signup credential logout from device first');
          }
        }catch(err){
          response.status(400).send(JSON.stringify({err_msg:err.message}));
        }  
      }else if(Data?.Purpose == 'login'){
        try{
          let data = await models.UserModel.exists({_id:Global.parseJWT("user_token",request.cookies)});
          if(data){
            let FilteredData = Global.setObjectKeys(Keys,Global.getRecords(await models.UserModel.findOne(data)));
            Data = Global.setObjectKeys(Keys,Data);
            Data['UserName'] = Data['UserName']?.toUpperCase();
            if(JSON.stringify(FilteredData)==JSON.stringify(Global.setObjectKeys(Keys,Data)))
              response.send(JSON.stringify({'redirect':'./chat'}));
            else
              throw new Error('invalid login credential logout from device first');
          }else{
            throw new Error('invalid login credential signup first');
          }
        }catch(err){
          response.status(400).send(JSON.stringify({err_msg:err.message}));
        }
      }
    },
    /**
     * sends user data to chat route
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    chat:async(request,response)=>{
      let Keys = Object.keys(models.UserSchema.paths).filter((fieldName)=>(fieldName !== '_id' && fieldName !== '__v'));
      try{
        let data = await models.UserModel.exists({_id:Global.parseJWT("user_token",request.cookies)});
        if(data){
          let FilteredData = await models.UserModel.findOne(data);
          let src = Global.getDP(FilteredData['_id']);
          FilteredData = Global.setObjectKeys(Keys,Global.getRecords(FilteredData));
          if(FilteredData)
            response.send(JSON.stringify({...FilteredData,DP:src}));
          else
            throw new Error('invalid login credential signup first');
        }else{
          throw new Error('invalid login credential signup first');
        }
      }catch(err){
        response.status(400).send(JSON.stringify({err_msg:err.message}));
      }
    },
    /**
    * manages user settings 
    * @param {express.Request} request 
    * @param {express.Response} response 
    */
    settings:async (request,response) => {
      //logout user
      try{
        let body = {...request.body};
        switch(body['purpose']){
          case ('fetch'):{
            let data = await models.UserModel.exists({_id:Global.parseJWT("user_token",request.cookies)});
            if(data){
              data = Global.getRecords(await models.UserModel.findOne(data));
              let src= Global.getDP(data._id);
              delete data['_id'];
              delete data['__v'];
              response.send({...data,DP:src});
            }else{
              response.send({...data,redirect:'./authentication'});
            }
          }
          case ('logout'):{
            response.clearCookie("user_token");
            response.send({'redirect':'./authentication'});
          }
          case ('DP change'):{
            let file = (Array.isArray(request.files?.file))?(request.files?.file[0]):(request.files?.file);
            fs.writeFileSync(`./public/client/${Global.parseJWT("user_token",request.cookies)}/DP.png`,file.data);
            file = Global.setObjectKeys(['name','size','mimetype'],file);
            response.send({...file,'redirect':'./settings'});
          }
          default:{
            throw new Error('out of option');   
          }
        }
      }catch(err){

      }
    } 
  }
}
export default ROUTES;
import express from "express";
import HTTP from "http";
import path from 'path';
import dotenv from "dotenv";
import routes from "./routes.js";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { Server } from "socket.io";
import CookieParser from "cookie-parser";
import ExpressFileUpload from "express-fileupload";
import WSE from './webSocketEvents.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


(async () => {
  try {
    console.clear();
    dotenv.config();
    const APP = express();
    const SERVER = HTTP.createServer(APP);
    const IO = new Server(SERVER);
    await mongoose.connect(process.env.DATABASE_URL);

    APP.use(express.static(__dirname + '/public'));
    APP.use(express.json());
    APP.use(express.urlencoded({ extended: true }));
    APP.use(CookieParser());
    APP.use(ExpressFileUpload({ safeFileNames: true }));

    
    
    
    /**
     * @typedef USERS 
     * @property {string} UserName
     * @property {string} Email
     * @property {string} DP0
     * @property {string} db_id
     */
    /**high priority saves alluser list
     * @name USER
     * @type {Map<string,USERS>}
     */
    let USER = new Map();
    IO.on('connection', (socket) => {
      
      socket.on('disconnect', (data) => {
        USER.delete(socket.id);
        WSE.ON.disconnect.execute(IO, socket, data, {socket_id:socket.id});
      });
      socket.on(WSE.ON.ClientData.name,data=>{
        WSE.ON.ClientData.execute(IO,socket,data,USER)
      })
      socket.on(WSE.ON.GetConnectedUser.name,(data)=>{
        WSE.ON.GetConnectedUser.execute(IO,socket,data);
      });

      socket.on(WSE.ON.SendMessage.name,(data)=>{
        WSE.ON.SendMessage.execute(IO,socket,data,USER);
      });

    });





    APP.get('/', routes.GET.home);

    APP.get('/authentication', routes.GET.authentication);
    APP.post('/authentication', routes.POST.authentication);

    APP.get('/chat', routes.GET.chat);
    APP.post('/chat', routes.POST.chat);

    APP.get('/settings', routes.GET.settings);
    APP.post('/settings', routes.POST.settings);

    SERVER.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT}`);
    });
  }
  catch (error) {
    console.log(error.message);
  }

})();
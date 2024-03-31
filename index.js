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
    dotenv.config();
    const APP = express();
    const SERVER = HTTP.createServer(APP);
    const IO = new Server(SERVER);
    await mongoose.connect(process.env.DATABASE_URL);

    APP.use(express.static(__dirname + '/public'));
    APP.use(express.json());
    APP.use(express.urlencoded({ extended: true }));
    APP.use(CookieParser());
    APP.use(ExpressFileUpload(
      {
        safeFileNames: true,
        limits: {
          fileSize: 1024 * 1024,
          files: 1
        }
      }));

    APP.set('view engine', 'ejs');
    APP.set('views', path.resolve('./views'));

    IO.on('connection', (socket) => {
      console.log('new connection established', socket.id);
      socket.on('disconnect', (data) => {
        console.log('connection closed', socket.id, data);
      });
      socket.on(WSE.ON.UserData.name,WSE.ON.UserData.execute);
      socket.emit('hello', 'hello line 41 index.js' + socket.id);
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
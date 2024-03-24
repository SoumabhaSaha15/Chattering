import  express  from "express";
import HTTP from "http";
import path from 'path';
import dotenv  from "dotenv";
import routes from "./routes.js";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import {Server} from "socket.io";
import CookieParser from "cookie-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(()=>{
  dotenv.config();
  const APP = express();
  const SERVER = HTTP.createServer(APP);
  const IO = new Server(SERVER);

  mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log(process.env.DATABASE_URL+' connected');
  }).catch(err=>{
    console.log(err.message);
  });

  APP.use(express.static(__dirname+'/public'));
  APP.use(express.json());
  APP.use(express.urlencoded({extended:true}));
  APP.use(CookieParser());
  APP.set('view engine','ejs');
  APP.set('views',path.resolve('./views'));
  
  // IO.on('connection',(socket)=>{
  //   console.log('new connection established',socket.id);
  //   socket.on('disconnect',(data)=>{
  //     console.log('connection closed',socket.id);
  //   })
  // })

  APP.get('/',routes.GET.home);
  
  APP.get('/authentication',routes.GET.authentication);
  APP.post('/authentication',routes.POST.authentication)

  SERVER.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`);
  })

})();
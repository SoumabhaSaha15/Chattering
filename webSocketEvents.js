import { Server, Socket } from "socket.io";
import  model from "./models.js";
import Global from './global.js';
const EVENTS = {
  ON:{
    UserData:{
      name:'UserData',
      /**
       * emits io alluser
       * @name UserData event  
       * @param {Server} io 
       * @param {Socket} socket 
       * @param {Object} data 
       * @param {Object} all_user
       */
      execute:(io,socket,data,all_user)=>{
        console.log(data);
        if(data['err_msg']){
          socket.disconnect(true);
        }else{
          all_user[socket.id] = {
            UserName:data['UserName'],
            Email:data['Email'],
            DP:data['DP'],
            db_id:data['_id']
          }
          io.emit(EVENTS.EMIT.AllUser.name,all_user);
        }
      }
    },
    disconnect:{
      name:'disconnect',
      /**
       * emits io Disconnect user
       * @name disconnect event
       * @param {Server} io 
       * @param {Socket} socket 
       * @param {import("socket.io").DisconnectReason} data
       * @param {Object} 
       */
      execute:(io,socket,data,userData)=>{
        io.emit(EVENTS.EMIT.DisconnectUser.name,userData);
      }
    },
    GetConnectedUser:{
      name:'GetConnectedUser',
      /**
       * emits all user from database
       * @name UserData event  
       * @param {Server} io 
       * @param {Socket} socket 
       * @param {Object} data 
       */
      execute:async(io,socket,data)=>{
        /**
         * @type {Object[]}
         */
        console.log(data);
        let records = JSON.parse(JSON.stringify(await model.UserModel.find({})));
        records = records.filter(item=>(item['_id']!= data)); 
        records = records.map(item => {
          let obj = Global.setObjectKeys(['UserName','_id','Email'],item);
          obj['DP'] = Global.getDP(obj['_id']);
          return obj;
        });
        socket.emit(EVENTS.EMIT.SetConnectedUser.name,records);
      }
    },
    SendMessage:{
      name:'SendMessage',
      /**
       * sends message
       * @param {Server} io
       * @param {Socket} socket
       * @param {*} data
       */
      execute:async (io,socket,data) => {
        Global.setObjectKeys(['sender','reciever','chat'],data);
        let message = new model.MessageModel(data);
        message.save();
      }
    }
  },
  EMIT:{
    AllUser:{
      name:'AllUser'
    },
    DisconnectUser:{
      name:'DisconnectUser'
    },
    SetConnectedUser:{
      name:'SetConnectedUser'
    },
    RecieveMessage:{
      name:'RecieveMessage',
      /**
       * sends message
       * @param {Server} io
       * @param {Socket} socket
       * @param {*} data
       */
      execute:async (io,socket,data) => {
        let recievedMessage = Global.getRecords(await model.MessageModel.find({reciever:data}));
        recievedMessage = recievedMessage.map(item=>Global.setObjectKeys(['reciever','sender','chat'],item));
        return recievedMessage;
      }
    }
  }
}
export default EVENTS;
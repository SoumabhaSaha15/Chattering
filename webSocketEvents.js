import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import  model from "./models.js";
import Global from './global.js';
    /**
     * @typedef USERS 
     * @property {string} UserName
     * @property {string} Email
     * @property {string} DP0
     * @property {string} db_id
     */
const EVENTS = {
  ON:{
    ClientData:{
      name:'ClientData',
      /**
       * emits io alluser
       * @name UserData event  
       * @param {Server} io 
       * @param {Socket} socket 
       * @param {Object} data 
       * @param {Map<string,USERS>} all_user
       */
      execute:(io,socket,data,all_user)=>{
        console.log(data);
        if(data['err_msg']){
          socket.disconnect(true);
        }else{
          all_user.set(socket.id,{
            UserName:data['UserName'],
            Email:data['Email'],
            DP:data['DP'],
            db_id:data['_id']
          });
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
        if(data){
          let records = JSON.parse(JSON.stringify(await model.UserModel.find({})));
          records = records.filter(item=>(item['_id']!= data)); 
          records = records.map(item => {
            let obj = Global.setObjectKeys(['UserName','_id','Email'],item);
            obj['DP'] = Global.getDP(obj['_id']);
            return obj;
          });
          socket.emit(EVENTS.EMIT.SetConnectedUser.name,records); 
        }else{
          socket.disconnect(true);
        }
      }
    },
    SendMessage:{
      name:'SendMessage',
      /**
       * sends message
       * @param {Server} io
       * @param {Socket} socket
       * @param {Object} data
       * @param {Map<string,USERS>}
       */
      execute:async (io,socket,data,all_user) => {
        // console.log(data);
        let sentData = Global.setObjectKeys(['sender','reciever','chat'],data);
        sentData['reciever'] = mongoose.Types.ObjectId.createFromHexString(sentData['reciever']);
          // parseInt(sentData['reciever'],16));
        sentData['sender'] = mongoose.Types.ObjectId.createFromHexString(sentData['sender']);
        let message = new model.MessageModel(sentData);
        let saved_record = await message.save(sentData);
        saved_record = Global.setObjectKeys(['sender','reciever','chat'],saved_record);
        console.log(saved_record);
        all_user.forEach((it,index) => {
          if(it.db_id==saved_record['reciever'].toHexString()){
            io.to(index).emit(EVENTS.EMIT.RecieveMessage.name,sentData);
          }
        });
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
      name:'RecieveMessage'
    }
  }
}
export default EVENTS;
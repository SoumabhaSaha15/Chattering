import { Server, Socket } from "socket.io";
const EVENTS = {
  ON:{
    UserData:{
      name:'UserData',
      /**
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
            DP:data['DP']
          }
          io.emit(EVENTS.EMIT.AllUser.name,all_user);
        }
      }
    },
    disconnect:{
      name:'disconnect',
      /**
       * @name disconnect event
       * @param {Server} io 
       * @param {Socket} socket 
       * @param {import("socket.io").DisconnectReason} data
       * @param {Object} 
       */
      execute:(io,socket,data,userData)=>{
        delete userData[socket.id];
        io.emit(EVENTS.EMIT.AllUser.name,userData);
      }
    }
  },
  EMIT:{
    AllUser:{
      name:'AllUser'
    },
  }
}
export default EVENTS;
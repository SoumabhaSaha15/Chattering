import { Server, Socket } from "socket.io";
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
    }
  },
  EMIT:{
    AllUser:{
      name:'AllUser'
    },
    DisconnectUser:{
      name:'DisconnectUser'
    },
  }
}
export default EVENTS;
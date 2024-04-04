import methods from "../../packages/methods.js";
(async () => {
  /**
   * @type {HTMLElement}
  */
  const MAIN = document.querySelector('body div#root main');
  /**
    * @type {HTMLImageElement}
    */
  const DP = document.querySelector('body div#root header img');
  /**
    * @type {HTMLElement}
    */
  const USERS = document.body.querySelector('div#root main section#users');
  const CHATS = document.body.querySelector('div#root main section#chats');
  try{
    let userData = await fetch(window.location.pathname,{
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body:(""),
    });
    userData = await userData.json();
    /**
     * @type {import("socket.io").Socket}
     */
    const SOCKET = io();
    let idUser='';
    SOCKET.on('connect',()=>{idUser = SOCKET.id;});
    SOCKET.on('disconnect',()=>{console.log('id:'+idUser);});
    SOCKET.emit('GetConnectedUser',userData['_id']);
    SOCKET.on('SetConnectedUser',(data)=>{ 
      USERS.innerHTML = methods.createUserDiv(data);
      data?.forEach(element => {
        document.getElementById(element._id).addEventListener('click',e=>{
          let reciever_data = {...e.currentTarget.dataset};
          let reciever_img = CHATS.querySelector('img[alt="reciever_info"]');
          let reciever_email = CHATS.querySelector('header span');
          let msg_box = CHATS.querySelector('div#writemsg textarea');
          let send_btn = CHATS.querySelector('div#writemsg button');
          reciever_img.src = reciever_data['dp'];
          reciever_img.id = e.currentTarget.id; 
          reciever_email.innerHTML = reciever_data['email'];
          msg_box.dataset['sender'] = userData['_id'];
          msg_box.dataset['reciever'] = e.currentTarget.id;
          send_btn.onclick=(e)=>{
            let op={msg:msg_box?.value,sender:msg_box.dataset['sender'],reciever:msg_box.dataset['reciever']};
            if(op['msg']){
              console.log(op);
            }
          }
        });
      });
    });
    DP.src = userData.DP;
    DP.onclick = (e) => {window.location.pathname = './settings';};
  }catch(err){
    console.log(err);
    window.location.pathname = './authentication';
  }
})();
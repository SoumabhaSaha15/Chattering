import methods from "../../packages/UserList.js";
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
    SOCKET.on('UserJoined',(d)=>{console.log(d);}); 
    SOCKET.on('disconnect',()=>{console.log('id:'+idUser);});
    SOCKET.emit('UserData',userData);
    SOCKET.on('AllUser',(data)=>{
      delete data[idUser];
      USERS.innerHTML = methods.createUserDiv(methods.objectToArray(data));
    });
    DP.src = userData.DP;
    DP.onclick = (e) => {window.location.pathname = './settings';};
  }catch(err){
    console.log(err);
    window.location.pathname = './authentication';
  }
})();
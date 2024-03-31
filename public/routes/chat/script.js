(async () => {
  /**
   * @type {HTMLElement}
  */
 const MAIN = document.querySelector('body div#root main');
 /**
  * @type {HTMLImageElement}
  */
 const DP = document.querySelector('body div#root header img');
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
    SOCKET.on('connect',()=>{
      idUser = SOCKET.id;
      let data = {socket_id:SOCKET.id};
      window.alert(JSON.stringify(data));
    });
    SOCKET.on('UserJoined',(d)=>{
      console.log(d);
    }); 
    SOCKET.on('disconnect',(d)=>{
      console.log('id:'+idUser,d);
    })
    SOCKET.emit('UserData',userData);
    SOCKET.on('AllUser',data=>{
      console.log(data);
    })
    DP.src = userData.DP;
    DP.onclick = (e) => {window.location.pathname = './settings';};
  }catch(err){
    console.log(err);
    window.location.pathname = './authentication';
  }
})();
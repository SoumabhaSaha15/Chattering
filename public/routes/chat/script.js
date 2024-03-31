(async () => {
  
  /**
   * @type {HTMLElement}
  */
 const MAIN = document.querySelector('body div#root main');
 const DP = document.querySelector('body div#root header img');
 try{
   let userData = await fetch(window.location.pathname,{
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body:(""),
    });
    userData = await userData.json();
    const SOCKET = io();
    SOCKET.on('connect',()=>{
      console.log('hello '+SOCKET.id);
    });
    SOCKET.on('hello',(d)=>{
      console.log(d);
    }) 
    /**
     * @function emitNewMessage
     * @description Emits a new message event to all connected clients.
     * @param {string} message The message content to be sent.
     */
    SOCKET.emit('data',userData);
    DP.src = userData?.DP;
    MAIN.innerText = JSON.stringify(userData);
    DP.onclick = (e) =>{
      window.location.pathname = './settings';  
    }
  }catch(err){
    console.log(err);
    window.location.pathname = './authentication';
  }
})();
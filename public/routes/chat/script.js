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
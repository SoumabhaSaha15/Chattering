"use strict";
(async()=>{
  /**
   * @type {HTMLFormElement}
   */
  let data = await fetch(window.location.pathname,{
    method:'post',
    headers:{ "Content-Type": "application/json" },
    body:JSON.stringify({"purpose":"fetch"}),
  });
  data = await data.json();
  let form = document.querySelector('form[name="user-info"]');
  // form.querySelectorAll('input').forEach(item=>{(data[item.name])?(item.value = data[item.name]):(console.log('undefined'))});
  // console.log(form)
  let img = form.querySelector('label img');
  /**
   * @type {HTMLInputElement}
  */
  img.src = data?.DP;
  let img_field = form.querySelector('input[type="file"]');
  img_field.onchange = (e) =>{
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    try{
      reader.readAsDataURL(e.target.files[0]);
    }catch(err){
      console.log(err);
    }
  }
  /**
   * @type {HTMLButtonElement}
   */
  const logout = document.body.querySelector('div#root header button');
  logout.onclick= async (e) =>{
    let data = await fetch(window.location.pathname,{
      method:'post',
      headers:{ "Content-Type": "application/json" },
      body:JSON.stringify({"purpose":"logout"}),
    });
    data = await data.json();
    location.pathname = data['redirect'];
    // console.log(data);
  };
  form.onsubmit = async (e) => {
    e.preventDefault();
    let FILE_DATA = new FormData();
    FILE_DATA.append("purpose","DP change");
    FILE_DATA.append("file",img_field.files[0]);
    let data = await fetch(window.location.pathname,{
      method:'post',
      body:FILE_DATA,
    });
    data = await data.json();

  }
})();
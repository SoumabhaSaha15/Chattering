"use strict";
(async()=>{
  /**
   * @type {HTMLFormElement}
   */
  window.alert('double click to change image');
  let data = await fetch(window.location.pathname,{
    method:'post',
    headers:{ "Content-Type": "application/json" },
    body:JSON.stringify({"purpose":"fetch"}),
  });
  data = await data.json();
  // img.src = data?.dp;
  console.log(data);
  let form = document.querySelector('form[name="user-info"]');
  // console.log(form)
  let img = form.querySelector('label img');
  /**
   * @type {HTMLInputElement}
   */
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
  
})();
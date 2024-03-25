(() => {
  const FORM = document.forms['authentication'];
  const SUBMIT = FORM.querySelector('input[type="submit"]');
  const TOGGLER = document.getElementById('toggler');
  const [SIGNUP,LOGIN] = TOGGLER.querySelectorAll('button');
  /**
   * @type {HTMLDialogElement}
   */
  const DIALOG = document.querySelector('dialog#message');
  // console.log(DIALOG);
  const CLOSE_MODAL = DIALOG.querySelector('button');

  CLOSE_MODAL.addEventListener('click',(e)=>{
    DIALOG.style.display = 'none';
    
    DIALOG.close();
  })

  SIGNUP.addEventListener('click', (e) => {
    TOGGLER.state = e.currentTarget.name;
    LOGIN.style.backgroundColor = 'var(--fore)';
    SIGNUP.style.backgroundColor = 'var(--back)';
    SUBMIT.value = TOGGLER.state;
  });
  LOGIN.addEventListener('click', (e) => {
    TOGGLER.state = e.currentTarget.name;
    LOGIN.style.backgroundColor = 'var(--back)';
    SIGNUP.style.backgroundColor = 'var(--fore)';
    SUBMIT.value = TOGGLER.state;
  });
  
  SIGNUP.click();
  
  FORM.onsubmit = (e) => {
    e.preventDefault();
    let Data = [...FORM.querySelectorAll('input[required][name]')].reduce((data, item) => {
      data[item?.name] = item?.value;
      return data;
    }, {});
    fetch(window.location.pathname, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Data),
    })
      .then(res => res.json())
      .then(data=>{
        console.log(data);
        if(data.hasOwnProperty('err_msg')){
          DIALOG.style.display = 'grid';
          DIALOG.querySelector('textarea[readonly]').textContent = data['err_msg']; 
          DIALOG.showModal();
        };
      })
      .catch(console.error);
  }


})();
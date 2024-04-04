const METHODS={
  /**
   * converts Object to array
   * @param {Object} obj 
   * @returns {Array}
   */
  objectToArray:(obj)=>{
    /**
     * @typedef UserObject 
     * @property {string} DP
     * @property {string} UserName
     * @property {string} Email
     * @property {string} socket_id
     */
    /**
     * @type {UserObject[]}
     */
    let arr = [];
    for(let key in obj){
      arr.push({socket_id:key,...obj[key]});
    }
    return arr;
  },
  /**
   * creates divs for user labeling
   * @param {UserObject[]} arr 
   * @returns {string} 
  */
  createUserDiv:(arr)=>{
    return arr.map((item)=>{
      return `<div id="${item['_id']}" class="users" data-user-name="${item.UserName}" data-dp="${item.DP}" data-email="${item.Email}">
                <img src="${item.DP}" alt="${item.Email}"/>
                <span>
                  ${item.UserName}
                  <br/>
                  ${item.Email}
                </span>
              </div>`
    }).join('');
  } 
};
export default METHODS;
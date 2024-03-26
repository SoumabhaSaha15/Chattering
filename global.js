import JWT from 'jsonwebtoken';
/**
 * getrecords filters docs from mongodb
 * @name getRecords
 * @param {*} object 
 * @returns {object}
 */
const getRecords = (object)=> JSON.parse(JSON.stringify(object));
/**
 * returns an object containing only keys 
 * @param {string[]} keys 
 * @param {Object} data
 * @returns {object}
 */ 
const setObjectKeys = (keys,data) => {
  let newData = {};
  keys.forEach(item => {
    newData[item] = (data[item])?(data[item]):(null);
  });
  return newData;
}
/**
 * @name parseJWT
 * @param {string} token 
 * @param {Object} obj 
 * @returns {string}
 */
const parseJWT = (token,obj) => (JWT.verify(obj[token],process.env.SECRET_KEY));
export default {getRecords,setObjectKeys,parseJWT}
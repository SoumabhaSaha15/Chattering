import JWT from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
const parseJWT = (token,obj) => {
    try{
      return (JWT.verify(obj[token],process.env.SECRET_KEY));
    }catch(err){
      console.log(err.message);
      return null;
    }
}
/**
 * @param {string} name 
 * @returns {string}
 */
const CreateFolder= (name)=>{
  try{
    fs.mkdirSync(`${__dirname}/public/client/${name}`);
    return `${__dirname}/public/client/${name}`;
  }catch(err){
    console.log(err.message);
    return null;
  }
}
/**
 * 
 */
const getDP = id =>(fs.existsSync(`${__dirname}/public/client/${id}/dp.png`))?
  (`./client/${id}/DP.png`):
  ('./icons/chat-icon.svg');
export default {getRecords,setObjectKeys,parseJWT,CreateFolder,getDP};
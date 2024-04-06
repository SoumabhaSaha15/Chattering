import mongoose from "mongoose";

const UserSchema  = new mongoose.Schema({
  UserName:{
    type:String,
    uppercase:true,
    required:true,
    validate:{
      validator:function(v){
        return /^[a-zA-Z ]{2,}$/.test(v)
      },
      message:(props) => (`${props.value} is not valid user name`)
    }
  },
  Email:{
    trim:true,
    type:String,
    required:true,
    unique: true,
    validate: {
      validator: function(v) {
        return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
      },
      message: (props) => (`${props.value} is not a valid email address!`)
    }
  },
  Password:{
    required:true,
    trim:true,
    type:String,
    unique:true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(v);
      },
      message: (props) => (`${props.value} is not a valid email address!`)
    }
  }
});

const UserModel = mongoose.model('UserModel',UserSchema);

const MessageSchema = new mongoose.Schema({
  sender:{
    type: mongoose.Schema.Types.ObjectId,
    require:true
  },
  reciever:{
    type: mongoose.Schema.Types.ObjectId,
    require:true
  },
  chat:{
    type:String,
    require:true
  }
},{
  timestamps:true
});

const MessageModel = mongoose.model('MessageModel',MessageSchema);
export default {UserSchema,UserModel,MessageModel,MessageSchema};
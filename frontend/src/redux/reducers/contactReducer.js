import { GET_ALL_CONTACTS, NAME, PHONE_NUMBER } from "../actionTypes.js/contactActionTypes"

const initialstate = {
    contacts:[],
    name:"",
    phoneNumber:""
}

export const contactReducer = (state = initialstate,{type,payload})=>{
  switch(type){
    case GET_ALL_CONTACTS :return{...state,contacts:payload};
    case NAME :return{...state,name:payload};
    case PHONE_NUMBER:return {...state,phoneNumber:payload};
    default :return{initialstate};
  }
}
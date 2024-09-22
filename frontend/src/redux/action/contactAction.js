import axios from "axios";
import { GET_ALL_CONTACTS } from "../actionTypes.js/contactActionTypes";


export const getContact = ()=>async(dispatch)=>{
    try {
        const get = await axios.get(`http://localhost:8080/contact`);
        console.log(get)
        dispatch({type:GET_ALL_CONTACTS,payload:get.data.contacts[0]});
        return get;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const getSearchedContact = (search)=>async(dispatch)=>{
    console.log(search)
    try {
        const get = await axios.get(`http://localhost:8080/contact/search`,{params:{search}});
        console.log(get)
        dispatch({type:GET_ALL_CONTACTS,payload:get.data.contacts[0]});
        return get;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const createContact =async(data)=>{
    try {
        const post = await axios.post(`http://localhost:8080/contact/create`,data);
        console.log(post)
        return post;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const updateContact =async(data)=>{
    try {
        const post = await axios.patch(`http://localhost:8080/contact/update`,data);
        console.log(post)
        return post;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const deleteContact =async(id,toast)=>{
    try {

        const deleteContactEntry = await axios.delete(`http://localhost:8080/contact/delete/${id}`);
        console.log(deleteContactEntry)
        toast({
            title: 'sucessfully Deleted',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        return deleteContactEntry;
    } catch (error) {
        toast({
            title: 'Failed deletion',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        console.log(error)
        return error;
    }
}
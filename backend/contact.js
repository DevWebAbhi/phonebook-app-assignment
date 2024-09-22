const {executeQuery} = require("./dbConfig");

const express = require("express");
const contactRouter = express.Router();

contactRouter.get("/",async(req,res)=>{
    try {
        const contacts = await executeQuery({
            query:"CALL phonebook.ListContacts()",
            values:[]
        });
        res.status(200).send({message:"sucessfull",contacts:contacts});
    } catch (error) {
        res.status(500).send({message:"internal server error"});
    }
})

contactRouter.get("/search",async(req,res)=>{
    const {search} = req.query;
    console.log(search)
    try {
        const contacts = await executeQuery({
            query:"CALL phonebook.SearchContacts(?)",
            values:[search || ""]
        });
        res.status(200).send({message:"sucessfull",contacts:contacts});
    } catch (error) {
        res.status(500).send({message:"internal server error"});
    }
})

contactRouter.post("/create",async(req,res)=>{
    const{name,contact} = req.body;
    console.log(name,contact)
    try {
        const contacts = await executeQuery({
            query:"CALL phonebook.AddContact(?,?)",
            values:[name,contact]
        });
        res.status(200).send({message:"sucessfull"});
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"internal server error"});
    }
})

contactRouter.patch("/update",async(req,res)=>{
    const{id,name,contact} = req.body;
    console.log(req.body)
    try {
        const contacts = await executeQuery({
            query:"CALL phonebook.UpdateContact(?,?,?)",
            values:[id,name,contact]
        });
        res.status(200).send({message:"sucessfull"});
    } catch (error) {
        res.status(500).send({message:"internal server error"});
    }
})

contactRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params; 
    console.log(id, req.params);
    try {
        const contacts = await executeQuery({
            query: "CALL phonebook.DeleteContact(?)",
            values: [id],
        });
        res.status(200).send({ message: "successful" });
    } catch (error) {
        res.status(500).send({ message: "internal server error" });
    }
});


module.exports = {contactRouter}
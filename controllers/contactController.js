const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = asyncHandler (async (req,res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

const getContact = asyncHandler (async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found!!");
    }
    res.status(200).json(contact);
});

const createContact = asyncHandler (async (req,res) => {
    console.log("The request body is : ", req.body);
    const { name , age, phoneNo } = req.body;
    if(!name || !age || !phoneNo) {
        res.status(400);
        throw new Error ("All fields are mandatory!");
    }

    const contact = await Contact.create({
        name,
        age,
        phoneNo,
        user_id : req.user.id
    });
    
    res.status(201).json(contact);
});

const updateContact = asyncHandler (async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found!!");
    }
    if(contact.user._id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true} 
    );

    res.status(201).json(updatedContact);
});

const deleteContact = asyncHandler (async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found!!");
    }
    if(contact.user._id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }


    await contact.deleteOne({ id: req.params.id }); 
    res.status(200).json(contact);
});

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact };
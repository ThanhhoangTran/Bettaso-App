const Message = require('../models/messageModel');
module.exports = io =>{
    io.on('connection', client=>{
        client.on("user connected", (data)=>{
            client.broadcast.emit("user connected", {
                content: `${data.userName} has joined the chat`
            });
        })
        client.on("disconnect", ()=>{
            client.broadcast.emit("user disconnected");
        });
        Message.find({}).sort({createdAt: -1}).limit(10).then(message=>{
            client.emit("load all messages", message.reverse());  
        });
        client.on("message", async data =>{
            let messageAttributes = {
                content: data.content,
                userName: data.userName, 
                user: data.userId
            }, m = new Message(messageAttributes);
            await m.save();
            io.emit("message", {
                content: messageAttributes
            })
        })
    }); 
}
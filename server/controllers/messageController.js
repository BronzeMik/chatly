import messageModel from "../model/MessageModel.js";

export const addMsg = async(req, res, next) => {
    try{
        const  {from, to, message} = req.body;

        const data = await messageModel.create({
            message: {
                text: message
            },
            users: [from, to],
            sender: from,

        })
        if(data) {
            return res.json({msg: "Message added successfully"});
        } else {
            res.json({msg: "Failed to send message."})
        }
    }
    catch(err) {
        next(err);
    }
}

export const getAllMsg = async(req, res, next) => {
    try{
        const {from, to} = req.body;
        const messages = await messageModel.find({
            users: {
                $all: [from, to]
            }
        }).sort({updatedAt: 1})

        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            }
        })

        res.json(projectMessages);
    }
    catch(err) {
        next(err);
    }
}

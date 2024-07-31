import express from 'express'

import { addMsg, getAllMsg } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.post("/sendms", addMsg)
messageRouter.post("/getms", getAllMsg)


export default messageRouter;

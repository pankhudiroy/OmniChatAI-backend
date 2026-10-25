import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/test", async(req,res) =>{
    try {
      const thread = new Thread({
        threadId : "xyz",
        content : "Testing new thread2"
      });

      const response = await thread.save();
      res.send(response);
    }catch(err){
      console.log(err);
      res.status(500).json({error: "Failed to save in DB"});
    }
});


//get request
router.get("/thread", authMiddleware, async(req, res)=>{
    try{
        const threads = await Thread.find({
            userId: req.userId
        }).sort({updatedAt: -1});
        // console.log("Authenticated user ID:", req.userId);
        // console.log("Threads found:", threads.length);
        res.send(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", authMiddleware, async(req, res)=>{
    const {threadId} = req.params;

    try{
        const threads = await Thread.findOne({
            threadId,
            userId: req.userId
        });
        if(!threads){
           return res.status(404).json({
            error: "Thread not found"
          });
        }
        // res.json(threads.message);
        res.send(threads.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

//delete route
router.delete("/thread/:threadId", authMiddleware, async(req, res)=>{
    const {threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({
            threadId,
            userId: req.userId
        });

        if(!deletedThread){
            return res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({success: "Thread deleted successfully"});
    }catch(err){
       console.log(err);
       res.status(500).json({error: "Failed to delete thread"});
    }
});

//post route
router.post("/chat", authMiddleware, async(req, res)=>{
    const {threadId, message} = req.body;
    // console.log("Authenticated user ID:", req.userId);

    if(!threadId || !message){
        return res.status(400).json({error:"Required fields are missing"});
    }

    try{
        let thread = await Thread.findOne({
            threadId,
            userId: req.userId
        });

        if (!thread) {
            const existingThread = await Thread.findOne({ threadId });

            if (existingThread) {
                return res.status(403).json({ error: "Access denied" });
            }
        }

        if(!thread){
            thread = new Thread ({
                threadId,
                title: message,
                userId: req.userId,
                messages: [{role:"user", content:message}],
            });
        }else{
           thread.messages.push({role:"user", content:message});
        }


        // console.log("THREAD MESSAGES:");
        // console.log(JSON.stringify(thread.messages, null, 2));

        const assistantReply = await getOpenAIAPIResponse(thread.messages);
        thread.messages.push({role:"assistant", content:assistantReply});
        thread.updatedAt= new Date();

        // console.log("Thread owner ID:", thread.userId);
        await thread.save();
        res.json({reply: assistantReply});

    }catch(err){
       console.log(err);
       res.status(500).json({error: "Something went wrong"});
    }
})

//put request (for updation)

// route.js
router.put("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId} = req.params;
  const { title } = req.body;

  try {
    const updatedThread = await Thread.findOneAndUpdate(
      { threadId, userId: req.userId },
      { title },
    );

    if (!updatedThread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.json(updatedThread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
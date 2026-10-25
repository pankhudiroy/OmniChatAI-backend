import "dotenv/config";

const getOpenAIAPIResponse = async (messages) =>{
    // console.log(
    //   "SENDING TO OPENAI:",
    //   JSON.stringify(messages, null, 2)
    // );

    const options = {
        method : "POST",
        headers : {
            "Content-Type": "application/json" ,
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body : JSON.stringify({
            model: "gpt-5.5",
            messages: messages,
        })
    };

    try{
    //    console.log("MESSAGES SENT TO OPENAI");
       console.log(JSON.stringify(messages, null, 2));
       const response = await fetch("https://api.openai.com/v1/chat/completions", options);
       const data = await response.json();
    //    console.log(data);
       return data.choices[0].message.content;
    }catch(err){
        console.log(err);
    }
}

export default getOpenAIAPIResponse;
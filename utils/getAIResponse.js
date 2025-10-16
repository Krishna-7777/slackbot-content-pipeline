async function getAIResponse(prompt) {

    let data = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.AI_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "meta-llama/llama-3.2-3b-instruct:free",
            "messages": [
                {
                    "role": "user",
                    "content": prompt || "What is the meaning of life?"
                }
            ]
        })
    })
    data = await data.json()
    
    // DEBUG 
    // data.prompt = prompt
    // require("fs").appendFileSync(`${Date.now()}-AI-Response.log`, JSON.stringify(data, null, 2))
    
    return data
}

module.exports = { getAIResponse }
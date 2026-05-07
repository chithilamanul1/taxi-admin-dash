const fetch = require('node-fetch');

async function testModel() {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: "Say hi" }],
            max_tokens: 2000
        })
    });
    console.log(res.status);
    console.log(await res.text());
}

testModel();

const fetch = require('node-fetch');

async function testModel(modelName) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: modelName,
            messages: [{ role: "user", content: "Say hi" }]
        })
    });
    console.log(modelName, res.status);
    if (!res.ok) {
        console.log(await res.text());
    }
}

async function run() {
    await testModel("google/gemini-2.0-flash-exp:free");
    await testModel("google/gemini-2.0-flash-lite-preview-02-05:free");
    await testModel("google/gemini-2.5-flash");
    await testModel("google/gemini-1.5-pro");
}

run();

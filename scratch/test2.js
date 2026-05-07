const fetch = require('node-fetch');

async function getModels() {
    const res = await fetch("https://openrouter.ai/api/v1/models");
    const data = await res.json();
    const freeModels = data.data.filter(m => m.pricing.prompt === "0" || m.pricing.prompt === 0 || m.id.includes(':free'));
    console.log("Free models starting with google:");
    console.log(freeModels.filter(m => m.id.startsWith('google')).map(m => m.id));
}

getModels();

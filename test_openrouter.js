require('dotenv').config({ path: '.env' });

async function test() {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    console.log('Key length:', OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0);
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [{ role: 'user', content: 'Hello' }]
        })
    });

    if (res.ok) {
        const data = await res.json();
        console.log('Success:', data.choices[0].message.content);
    } else {
        const errText = await res.text();
        console.error('Error:', res.status, errText);
    }
}

test();

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { title, price } = await req.json();

    if (!title || !price) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    const keysString = process.env.GROQ_API_KEYS || '';
    let keys = keysString.split(',').map(k => k.trim()).filter(k => k);
    
    // Acak urutan API keys (Load Balancing & Fallback)
    keys = keys.sort(() => Math.random() - 0.5);

    if (keys.length === 0) {
      return NextResponse.json({ error: 'No API keys configured' }, { status: 500 });
    }

    const systemPrompt = `Kamu adalah asisten admin untuk platform rental game SehwaRent. Tugasmu adalah membuatkan deskripsi produk dan template chat WhatsApp default berdasarkan nama produk dan harga yang diberikan.
Berikan respon dalam format JSON murni TANPA markdown block (tidak boleh ada \`\`\`json) dengan struktur persis seperti ini:
{
  "description": "Deskripsi lengkap dengan format profesional, sebutkan aturan dilarang menggunakan cheat, dll",
  "whatsapp_text": "Halo admin SehwaRent, saya tertarik untuk menyewa..."
}

Aturan Deskripsi:
- Gunakan bahasa yang menarik dan profesional.
- Tekankan bahwa dilarang keras menggunakan program ilegal/cheat.
- Buat dalam beberapa paragraf/poin.

Aturan WhatsApp Text:
- Singkat, ramah, menyebutkan nama produk yang spesifik dan harganya.
`;

    const userMessage = `Buatkan untuk produk berikut:\nNama Produk: ${title}\nHarga: ${price}`;

    let lastError = null;
    let successfulData = null;

    // Load Balancer Logic: Try keys sequentially
    for (const key of keys) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b', // Tested working model
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 500,
            response_format: { type: 'json_object' }
          })
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(`API Error: ${res.status} - ${err.error?.message || 'Unknown'}`);
        }

        const data = await res.json();
        const content = data.choices[0].message.content;
        successfulData = JSON.parse(content);
        
        // If success, break the loop
        break;
      } catch (err) {
        lastError = err.message;
        console.warn(`Groq API failed with key ${key.substring(0, 8)}... Trying next key. Error: ${lastError}`);
        // Continue to the next key
      }
    }

    if (successfulData) {
      return NextResponse.json(successfulData);
    } else {
      return NextResponse.json({ error: 'All API keys failed. Last error: ' + lastError }, { status: 500 });
    }

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

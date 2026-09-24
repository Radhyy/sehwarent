import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const host = url.origin; // e.g. https://sehwarent.vercel.app
    const webhookUrl = `${host}/api/telegram`;

    const telegramApi = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook?url=${webhookUrl}`;
    
    const res = await fetch(telegramApi);
    const data = await res.json();

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook terpasang!', 
      webhook_url: webhookUrl,
      telegram_response: data 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

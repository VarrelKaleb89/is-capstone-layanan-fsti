// app/api/survey-proxy/route.js
import { NextResponse, NextRequest } from 'next/server';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyubSUWWwvIk1a5H109wFNlQDqB8Y67LRC00ayV5lNn0VYUn6Tu86MeZFf1sxWaAmdOUg/exec';

export async function POST(request: NextRequest) {
  try {
    // Baca JSON body yang dikirim frontend
    const body = await request.json();

    // Teruskan ke Google Apps Script
    const resp = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Baca respons GAS
    const data = await resp.json();
    // Kirim balik ke frontend, status sesuai GAS
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Proxy error: ' + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}

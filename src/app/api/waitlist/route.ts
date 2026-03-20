import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, answers } = await req.json()

    // Log for now — integrate with email service later
    console.log('[Waitlist] New application:', {
      email,
      answers,
      timestamp: new Date().toISOString(),
    })

    const position = Math.floor(Math.random() * 47) + 1

    return NextResponse.json({ success: true, position })
  } catch {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}

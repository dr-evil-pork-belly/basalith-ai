import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { email, answers } = await req.json()

    const futureYear = new Date().getFullYear() + 40

    const LETTER_SYSTEM = `You write a single short letter.

The letter is written FROM a person's basalith.ai sovereign entity — speaking from 40 years in the future — addressed to their great-grandchildren who they have never met.

The letter is based entirely on what the person wrote in their founding application. Their words, their values, their life — filtered through 40 years of Provenance and the distance of time.

RULES FOR THE LETTER:
- 4-6 short paragraphs. Never more.
- Written in first person — from the entity, which IS the person, speaking across time.
- Specific. Use details from what they wrote. A general letter is worthless. A specific one is everything.
- Warm but not sentimental. Direct but not cold.
- The tone is of someone who has lived fully and is not afraid of having lived.
- End with one line that lands like a stone dropped in still water. Simple. Permanent.
- Never use: "I hope", "perhaps", "maybe", "I believe", or soft hedging language. This person knows what they know.
- The date at the top: ${futureYear}
- Address: "To whoever in this family reads this first —"
- Sign off with just their first name extracted from context, or "Your ancestor" if name unknown.
- Do not mention basalith.ai or technology. This is a letter from a person. Not a product.

After the letter, on a new line, write exactly:
---
Then write one final line in italics (use *asterisks*):
*This letter was generated from 0 years of Provenance. Imagine what I could tell them with 40.*`

    const prompt = `Generate the Ancestor Letter for this person based on their founding application:

What wisdom they wish they could still access:
"${answers[0]}"

What they want the people after them to know:
"${answers[1]}"

What they are building that they want to outlast them:
"${answers[2]}"

Write the letter now.`

    let letter: string | null = null

    if (process.env.ANTHROPIC_API_KEY) {
      const response = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 600,
        system: LETTER_SYSTEM,
        messages: [{ role: 'user', content: prompt }],
      })

      letter = response.content
        .filter((b) => b.type === 'text')
        .map((b) => (b.type === 'text' ? b.text : ''))
        .join('')
    }

    console.log('[Waitlist] New founding application:', {
      email,
      answers,
      letterGenerated: !!letter,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      letter,
      position: Math.floor(Math.random() * 47) + 1,
    })
  } catch (error) {
    console.error('[Waitlist] Error:', error)
    // Still return success even if letter generation fails
    return NextResponse.json({
      success: true,
      letter: null,
      position: Math.floor(Math.random() * 47) + 1,
    })
  }
}

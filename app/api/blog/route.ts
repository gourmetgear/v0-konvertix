import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward the request to the n8n webhook
    const response = await fetch('https://n8n.konvertix.de/webhook/create-blog/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const data = await response.text() // n8n webhooks might return text instead of JSON
      return NextResponse.json({
        success: true,
        message: 'Blog post request sent successfully',
        data
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send blog post request'
        },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error forwarding blog post request:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('📝 Create Task API called with:', body)

    const {
      title,
      description,
      status = 'pending',
      priority = 'medium',
      assigned_to,
      due_date,
      project_id,
      tags,
      metadata
    } = body

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    // Prepare data for n8n webhook
    const webhookData = {
      title,
      description,
      status,
      priority,
      assigned_to,
      due_date,
      project_id,
      tags: tags || [],
      metadata: metadata || {},
      created_at: new Date().toISOString(),
      account_id: process.env.NEXT_PUBLIC_ACCOUNT_ID
    }

    console.log('Sending task to webhook:', webhookData)

    // Call n8n webhook
    const webhookUrl = 'https://n8n.konvertix.de/webhook/create-task'

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    })

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('n8n webhook error:', {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        error: errorText,
        sentData: webhookData
      })

      return NextResponse.json(
        {
          error: 'Failed to create task via webhook',
          details: errorText,
          status: webhookResponse.status,
          sentData: webhookData
        },
        { status: 500 }
      )
    }

    const webhookResult = await webhookResponse.json()
    console.log('Task created successfully:', webhookResult)

    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      data: webhookResult,
    })

  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'

// Debug endpoint to help with onboarding issues
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Onboarding debug endpoint',
    instructions: [
      'POST /api/debug-onboarding - Clear onboarding localStorage',
      'Use this if users are stuck in onboarding loop',
      'Tell users to visit this URL to clear their onboarding state'
    ]
  })
}

// POST endpoint to clear onboarding state (for debugging)
export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Onboarding state cleared',
    script: `
      <script>
        localStorage.removeItem('konvertix-onboarding');
        alert('Onboarding state cleared! You can now go through onboarding again.');
        window.location.href = '/onboarding';
      </script>
    `,
    instructions: 'Use the browser console to run: localStorage.removeItem("konvertix-onboarding")'
  })
}
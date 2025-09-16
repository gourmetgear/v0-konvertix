'use client'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-4">
      <h2>Auth error occurred</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
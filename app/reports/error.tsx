'use client'

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-4">
      <h2>Something went wrong in reports!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
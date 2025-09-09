export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b021c] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a545b6] mx-auto mb-4"></div>
        <p className="text-[#afafaf]">Loading Competitor Analysis...</p>
      </div>
    </div>
  )
}

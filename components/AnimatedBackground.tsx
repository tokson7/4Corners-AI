export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Existing background gradient - UNCHANGED */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />
      
      {/* Falling stars overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Wave 1: 3 stars starting at 0s */}
        <div className="falling-star star-w1-1"></div>
        <div className="falling-star star-w1-2"></div>
        <div className="falling-star star-w1-3"></div>
        
        {/* Wave 2: 4 stars starting at 3s */}
        <div className="falling-star star-w2-1"></div>
        <div className="falling-star star-w2-2"></div>
        <div className="falling-star star-w2-3"></div>
        <div className="falling-star star-w2-4"></div>
        
        {/* Wave 3: 3 stars starting at 6.5s */}
        <div className="falling-star star-w3-1"></div>
        <div className="falling-star star-w3-2"></div>
        <div className="falling-star star-w3-3"></div>
      </div>
    </div>
  )
}

"use client"
import Link from "next/link"

function Hero() {
  return (
    <section className="bg-slate-900 text-white py-16 px-6 lg:py-32 flex flex-col items-center text-center">
      <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter mb-6 italic text-blue-500 text-center">
        FirstFlightTravel
      </h1>
      <p className="max-w-2xl text-slate-400 text-sm sm:text-base lg:text-lg mb-10 leading-relaxed text-center">
        Premium travel experiences designed by the Department of Software Engineering. Your journey starts here.
      </p>
      
      {/* Buttons with Links */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link href="/login" className="flex-1">
          <button className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl border-none font-bold text-white shadow-lg transition-all active:scale-95">
            Book Now
          </button>
        </Link>
        
        <Link href="/flights" className="flex-1">
          <button className="w-full h-14 rounded-2xl border border-slate-700 text-white hover:bg-slate-800 transition-all active:scale-95">
            Explore
          </button>
        </Link>
      </div>
    </section>
  )
}

export default Hero
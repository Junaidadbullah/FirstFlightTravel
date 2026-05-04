"use client"

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-5 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 mb-3">
          
          {/* Brand/Uni Info */}
          <div className="space-y-4 text-center lg:text-left">
            <h4 className="text-lg font-black italic text-slate-900 uppercase tracking-tighter">
              FirstFlight<span className="text-blue-600">Travel</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto lg:mx-0 font-medium">
              A premium travel portal developed by the Department of Software Engineering, University of Lahore. Mentored by Miss Aimen Fatima.
            </p>
          </div>

          {/* Team Members */}
          <div className="text-center lg:text-left">
            <h5 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 mb-6">Engineering Team</h5>
            <div className="grid grid-cols-2 gap-4">
              {["Junaid Ali", "Ahsan Ali", "Jawad Ali", "Abdullah Kashif"].map((name) => (
                <p key={name} className="text-xs font-bold text-slate-600">{name}</p>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-right space-y-2 flex flex-col items-center lg:items-end">
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4">Quick Access</h5>
            <p className="text-xs font-bold hover:text-blue-600 cursor-pointer">Security Protocol</p>
            <p className="text-xs font-bold hover:text-blue-600 cursor-pointer">Travel Support</p>
          </div>
        </div>
          <div className=" mx-auto text-center">
          <p className="text-[12px] font-black text-slate-900 ">
            © 2026 SDC Project • Superior University
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
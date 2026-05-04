"use client"
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GoPerson, 
  GoShieldCheck, 
  GoCreditCard, 
  GoVerified, 
  GoSignOut, 
  GoPaperAirplane, // Explore Flights ke liye behtar icon
  GoRows,          // Hamburger icon fix
  GoX              // Close icon
} from "react-icons/go";
import { sendRequest } from "@/lib/api";

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const flightId = searchParams.get("flightId");

  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    passengerName: "",
    passportNumber: "",
    contactEmail: "",
    phone: ""
  });

  useEffect(() => {
    if (!flightId) router.push("/flights");
  }, [flightId, router]);

  const validate = () => {
    let newErrors = {};
    const phoneRegex = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Invalid Phone (e.g. 03001234567)";

    const passportRegex = /^[A-Z0-9]{7,12}$/i;
    if (!passportRegex.test(formData.passportNumber)) newErrors.passport = "Invalid Passport (7-12 characters)";

    if (formData.passengerName.length < 3) newErrors.name = "Name is too short";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await sendRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          flightId: Number(flightId),
          ...formData
        })
      });
      alert("Booking Confirmed Successfully!");
      router.push("/dashboard/profile");
    } catch (err) {
      alert("Booking Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">FF</div>
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><GoX size={24} /></button>
          </div>

          <nav className="flex-1 space-y-3">
            <SidebarBtn icon={<GoPerson />} label="My Profile" onClick={() => router.push('/dashboard/profile')} />
            <SidebarBtn icon={<GoPaperAirplane />} label="Flight Deck" onClick={() => router.push('/flights')} />
            
            <div className="pt-6 mt-6 border-t border-slate-50">
              <button onClick={handleLogout} className="w-full flex items-center gap-4 h-14 px-5 rounded-2xl text-red-500 hover:bg-red-50 font-black uppercase tracking-widest text-[10px] transition-all">
                <GoSignOut size={18} /> Sign Out
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-40">
           <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-50 rounded-xl text-slate-900"><GoRows size={24}/></button>
           <h2 className="text-xl font-black italic text-slate-900 uppercase tracking-tighter">Checkout</h2>
           <div className="w-10"></div>
        </div>

        <div className="py-12 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8">
              <header className="mb-12">
                <div className="flex items-center gap-2 text-blue-600 mb-2 font-black uppercase text-[10px] tracking-[0.4em]">
                  <GoVerified className="animate-pulse" /> Secure Manifest
                </div>
                <h1 className="text-5xl lg:text-7xl font-black italic text-slate-900 uppercase tracking-tighter leading-none">
                  Passenger <br /> <span className="text-blue-600">Information.</span>
                </h1>
              </header>

              <form onSubmit={handleSubmit}>
                <Card className="border-none shadow-xl rounded-[3rem] bg-white overflow-hidden">
                  <CardContent className="p-10 lg:p-16 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormGroup label="Full Name" error={errors.name}>
                        <Input 
                          placeholder="Name" 
                          value={formData.passengerName}
                          onChange={(e) => setFormData({...formData, passengerName: e.target.value})}
                          className={`h-16 rounded-2xl bg-slate-50 border-none px-6 font-bold ${errors.name ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-blue-600'}`}
                        />
                      </FormGroup>

                      <FormGroup label="Passport Number" error={errors.passport}>
                        <Input 
                          placeholder="ABC123456" 
                          value={formData.passportNumber}
                          onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
                          className={`h-16 rounded-2xl bg-slate-50 border-none px-6 font-bold ${errors.passport ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-blue-600'}`}
                        />
                      </FormGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormGroup label="Contact Email">
                        <Input 
                          type="email"
                          placeholder="admin@gmail.com" 
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                          className="h-16 rounded-2xl bg-slate-50 border-none px-6 font-bold focus:ring-2 focus:ring-blue-600"
                        />
                      </FormGroup>

                      <FormGroup label="Phone Number" error={errors.phone}>
                        <Input 
                          placeholder="0300******" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={`h-16 rounded-2xl bg-slate-50 border-none px-6 font-bold ${errors.phone ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-blue-600'}`}
                        />
                      </FormGroup>
                    </div>

                    <Button disabled={loading} className="w-full h-20 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-[1.8rem] shadow-2xl transition-all uppercase tracking-widest text-xs">
                      {loading ? "Processing..." : "Confirm Flight Reservation"}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 lg:mt-40 space-y-8">
              <Card className="border-none bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <h3 className="font-black italic uppercase text-2xl mb-2">Safe & Secure</h3>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest leading-relaxed">End-to-End Encryption Active</p>
                <GoShieldCheck size={120} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
              </Card>

              <Card className="border-none bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50">
                <div className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-6">
                  <GoCreditCard size={16} /> Details
                </div>
                <div className="space-y-4">
                  <SummaryItem label="Flight ID" value={`#${flightId}`} />
                  <div className="h-[1px] bg-slate-100 w-full"></div>
                  <SummaryItem label="Class" value="Economy Premium" color="text-blue-600" />
                </div>
              </Card>
            </div>

          </div>
        </div>
      </main>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" />}
    </div>
  );
}

// UI Helpers
function SidebarBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 h-14 px-5 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 font-black uppercase tracking-widest text-[10px] transition-all">
      <span className="text-lg">{icon}</span> {label}
    </button>
  );
}

function FormGroup({ label, children, error }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest italic">{label}</label>
      {children}
      {error && <p className="text-[10px] text-red-500 font-black ml-4 uppercase italic tracking-tighter">{error}</p>}
    </div>
  );
}

function SummaryItem({ label, value, color = "text-slate-900" }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black text-slate-400 uppercase italic">{label}</span>
      <span className={`font-black ${color} uppercase text-xs italic`}>{value}</span>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-black uppercase text-slate-300 animate-pulse tracking-[0.5em]">Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
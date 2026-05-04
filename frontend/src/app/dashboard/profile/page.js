"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  GoPerson, 
  GoPaperAirplane, 
  GoSignOut, 
  GoShieldLock, 
  GoVerified, 
  GoXCircleFill, 
  GoSync, 
  GoClock, 
  GoLocation, 
  GoRows,
  GoInfo 
} from "react-icons/go";
import { sendRequest } from "@/lib/api";

export default function ProfileDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("profile");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [passwords, setPasswords] = useState({ old: "", new: "" });
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [userData, bookingsData] = await Promise.all([
        sendRequest('/auth/profile'),
        sendRequest('/bookings/my-bookings')
      ]);
      setUser(userData);
      setBookings(bookingsData);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!confirm("Confirm cancellation?")) return;
    try {
      await sendRequest(`/bookings/${id}/cancel`, { method: 'PATCH' });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    try {
      await sendRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword: passwords.old, newPassword: passwords.new })
      });
      alert("Password Updated!");
      setPasswords({ old: "", new: "" });
      setView("profile");
    } catch (err) {
      alert(err.message);
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse uppercase tracking-[0.5em]">Initialising Portal...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f1f5f9] font-sans text-slate-900">
      
      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden bg-white p-4 flex justify-between items-center border-b border-slate-200 sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-sm">FF</div>
            <span className="font-black italic text-slate-900 tracking-tighter uppercase">
                {user?.name || 'User'}
            </span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-lg active:scale-95 transition-all text-slate-900">
            <GoRows size={20} />
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:sticky top-0 left-0 w-72 lg:w-80 bg-white border-r border-slate-200 flex flex-col p-6 lg:p-8 h-screen z-50 transition-transform duration-300 ease-in-out
      `}>
        <div className="mb-10 hidden lg:flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">FF</div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter truncate">{user?.name || "Member"}</h2>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none mt-1 italic">Verified Account</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-3">
          <SidebarBtn active={view === 'profile'} icon={<GoPerson />} label="Personal Intel" onClick={() => {setView("profile"); setSidebarOpen(false);}} />
          <SidebarBtn active={view === 'password'} icon={<GoShieldLock />} label="Security Matrix" onClick={() => {setView("password"); setSidebarOpen(false);}} />
          <SidebarBtn active={false} icon={<GoPaperAirplane />} label="Flight Deck" onClick={() => router.push('/flights')} />
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 h-14 px-5 rounded-2xl text-red-500 hover:bg-red-50 font-black uppercase tracking-widest text-[10px] transition-all">
                <GoSignOut size={18} /> <span>Secure Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 lg:p-12 overflow-x-hidden">
        
        <header className="mb-8 lg:mb-16">
          <div className="flex items-center gap-2 text-blue-600 mb-2 font-black uppercase text-[9px] tracking-[0.4em]">
            <GoVerified className="animate-pulse" /> Authentication Status: Level 1
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic text-slate-900 uppercase tracking-tighter leading-none break-words">
            Welcome, <br className="hidden md:block" /> 
            {/* 👇 Yahan Welcome ke baad naam update kar diya */}
            <span className="text-blue-600 underline decoration-4 lg:decoration-8 decoration-blue-100 underline-offset-4 lg:underline-offset-8">
                {user?.name || "Passenger"}
            </span>
          </h1>
        </header>

        {view === "profile" ? (
          <div className="space-y-8 lg:space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <StatCard icon={<GoPaperAirplane />} label="Total Trips" value={bookings.length} color="blue" />
               <StatCard icon={<GoClock />} label="Confirmed" value={bookings.filter(b => b.status === 'CONFIRMED').length} color="green" />
               <StatCard icon={<GoXCircleFill />} label="Cancelled" value={bookings.filter(b => b.status === 'CANCELLED').length} color="red" />
               <StatCard icon={<GoInfo />} label="Account Role" value={user?.role} color="slate" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
              {/* Profile Card */}
              <div className="xl:col-span-4">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                  <div className="h-20 bg-blue-600"></div>
                  <CardContent className="p-8 lg:p-10 -mt-10 text-center xl:text-left">
                    <div className="h-20 w-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 border-4 border-white mx-auto xl:mx-0">
                      <GoPerson size={32} className="text-blue-600" />
                    </div>
                    <div className="space-y-5">
                      <h3 className="font-black text-xl text-slate-900 uppercase italic tracking-tighter border-b border-slate-50 pb-4">Profile Dossier</h3>
                      <div className="space-y-4">
                        {/* 👇 Yahan Legal Name update ho raha hai */}
                        <InfoItem label="Legal Name" value={user?.name || "Not Found"} />
                        <InfoItem label="Email Gateway" value={user?.email} />
                        <InfoItem label="Membership" value={user?.role} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bookings */}
              <div className="xl:col-span-8 space-y-6">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Reservation History</h3>
                  <GoSync className="text-slate-300 cursor-pointer hover:text-blue-600" onClick={fetchInitialData} />
                </div>
                
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="border-none shadow-md hover:shadow-xl rounded-[2rem] bg-white overflow-hidden transition-all group">
                      <CardContent className="p-0 flex flex-col sm:flex-row items-stretch">
                        <div className={`w-2 sm:w-3 h-2 sm:h-auto ${booking.status === 'CANCELLED' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        <div className="p-6 lg:p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase italic">#{booking.id}</span>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase italic ${booking.status === 'CANCELLED' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>{booking.status}</span>
                            </div>
                            <h4 className="text-lg lg:text-xl font-black text-slate-900 uppercase italic tracking-tighter truncate">{booking.passengerName}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <GoLocation size={10} className="text-blue-500"/> ID: {booking.passportNumber}
                            </p>
                          </div>
                          <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2">
                            <div className="hidden md:block text-right text-xs">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Route Reference</p>
                               <p className="font-black text-slate-900 uppercase italic">Flight: {booking.flightId}</p>
                            </div>
                            {booking.status !== 'CANCELLED' && (
                              <Button onClick={() => handleCancelBooking(booking.id)} className="h-10 px-4 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all font-black uppercase text-[8px] tracking-widest border-none">
                                <GoXCircleFill className="mr-1" size={14} /> Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Change Password View */
          <div className="max-w-2xl">
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8 lg:p-16">
              <h3 className="text-2xl lg:text-3xl font-black italic uppercase text-slate-900 mb-8 flex items-center gap-4">
                <GoShieldLock className="text-blue-600" /> Security matrix
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Current Code</label>
                  <Input type="password" required value={passwords.old} onChange={(e) => setPasswords({...passwords, old: e.target.value})} className="h-16 rounded-2xl bg-slate-50 border-none px-6 font-black focus:ring-2 focus:ring-blue-100 transition-all shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">New Matrix</label>
                  <Input type="password" required value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="h-16 rounded-2xl bg-slate-50 border-none px-6 font-black focus:ring-2 focus:ring-blue-100 transition-all shadow-inner" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                   <Button type="button" onClick={() => setView("profile")} className="h-14 flex-1 bg-slate-100 text-slate-900 font-black rounded-xl uppercase text-[9px] tracking-widest">Abort</Button>
                   <Button disabled={passLoading} className="h-14 flex-[2] bg-slate-900 hover:bg-blue-600 text-white font-black rounded-xl uppercase text-[9px] tracking-widest transition-all shadow-xl">
                     {passLoading ? "Verifying..." : "Update Security"}
                   </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
      
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" />
      )}
    </div>
  );
}

// Side Components
function SidebarBtn({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-4 h-14 px-5 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <span className="text-lg">{icon}</span> <span>{label}</span>
        </button>
    );
}

function StatCard({ icon, label, value, color }) {
   const colors = {
      blue: "text-blue-600 bg-blue-50",
      green: "text-green-600 bg-green-50",
      red: "text-red-600 bg-red-50",
      slate: "text-slate-600 bg-slate-50",
   }
   return (
      <Card className="border-none shadow-md rounded-[1.5rem] bg-white p-4 lg:p-6 transition-all hover:translate-y-[-4px]">
         <div className={`h-10 w-10 lg:h-12 lg:w-12 rounded-xl flex items-center justify-center mb-3 lg:mb-4 ${colors[color]}`}>
            {icon}
         </div>
         <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{label}</p>
         <h4 className="text-xl lg:text-3xl font-black text-slate-900 italic mt-0.5 tracking-tighter">{value}</h4>
      </Card>
   )
}

function InfoItem({ label, value }) {
   return (
      <div className="flex flex-col gap-0.5">
         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">{label}</span>
         <span className="font-black text-slate-900 italic uppercase text-xs break-all">{value || 'N/A'}</span>
      </div>
   )
}
"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GoPeople, GoPackage, GoTrash, 
  GoShield, GoGraph, GoMail, GoSignOut, 
  GoRows, GoX, GoLocation, GoPulse
} from "react-icons/go";
import { sendRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newFlight, setNewFlight] = useState({ origin: "", destination: "", price: "", date: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "USER" });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [uData, fData, iData] = await Promise.all([
        sendRequest('/users').catch(() => []),
        sendRequest('/flights').catch(() => []),
        sendRequest('/inquiries').catch(() => [])
      ]);
      setUsers(uData || []);
      setFlights(fData || []);
      setInquiries(iData || []);
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddFlight = async (e) => {
    e.preventDefault();
    try {
      await sendRequest('/flights', {
        method: 'POST',
        body: JSON.stringify({ ...newFlight, price: Number(newFlight.price) }),
      });
      alert("Flight added!");
      setNewFlight({ origin: "", destination: "", price: "", date: "" });
      fetchAllData();
    } catch (err) { alert(err.message); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await sendRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });
      alert("User registered!");
      setNewUser({ name: "", email: "", password: "", role: "USER" });
      fetchAllData();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (endpoint, id, role = "USER") => {
    if (role === "ADMIN") {
      alert("Restriction: System Admins cannot be deleted.");
      return;
    }
    if (window.confirm("Confirm permanent deletion?")) {
      try {
        await sendRequest(`${endpoint}/${id}`, { method: 'DELETE' });
        fetchAllData();
      } catch (err) { alert(err.message); }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push('/login');
  };

  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <GoPulse className="text-blue-600 animate-pulse" size={50} />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f1f5f9] font-sans text-slate-800">
      
      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden bg-slate-950 p-4 flex justify-between items-center text-white sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl"><GoShield size={18} /></div>
          <span className="font-black uppercase text-xs tracking-widest">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white/10 rounded-lg">
            <GoRows size={24} />
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:sticky top-0 left-0 w-72 lg:w-80 bg-slate-950 flex flex-col p-8 h-screen z-50 text-white transition-transform duration-300
      `}>
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg"><GoShield size={24} /></div>
            <p className="font-black italic text-lg uppercase tracking-tighter">Console</p>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><GoX size={24}/></button>
        </div>

        <nav className="flex-grow space-y-2">
          <SidebarTab id="analytics" label="Overview" icon={<GoGraph />} activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          <SidebarTab id="users" label="User Registry" icon={<GoPeople />} activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          <SidebarTab id="flights" label="Inventory" icon={<GoPackage />} activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          <SidebarTab id="messages" label="Inquiries" icon={<GoMail />} activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          
          <div className="pt-8">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-[1.2rem] h-14 font-black uppercase tracking-widest text-[10px] transition-all">
                <GoSignOut size={16} /> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto w-full">
        
        {activeTab === "analytics" && (
          <div className="space-y-10 animate-in fade-in duration-700 max-w-6xl mx-auto">
            <header>
              <h1 className="text-5xl lg:text-7xl font-black italic text-slate-900 uppercase tracking-tighter">
                ADMIN PANEL <span className="text-blue-600">Overview.</span>
              </h1>
            </header>

            {/* 3 BOX LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Users" value={users.length} icon={<GoPeople />} desc={`${adminCount} Admin Access`} color="blue" />
              <StatCard title="Live Flights" value={flights.length} icon={<GoPackage />} desc="Active Routes" color="slate" />
              <StatCard title="Total Inquiries" value={inquiries.length} icon={<GoMail />} desc="Pending Support" color="red" />
            </div>

            <Card className="border-none bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
                <h3 className="font-black italic uppercase text-2xl flex items-center gap-3 mb-8">
                    <GoMail className="text-blue-600" size={28}/> Recent Inquiries
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {inquiries.slice(-6).reverse().map((iq, idx) => (
                    <div key={idx} className="flex flex-col bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <span className="font-black uppercase text-xs text-blue-600 mb-1">{iq.name}</span>
                      <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-3">{iq.email}</span>
                      <p className="text-slate-700 font-medium text-sm italic truncate">"{iq.message}"</p>
                    </div>
                  ))}
                  {inquiries.length === 0 && <p className="text-sm font-black uppercase text-slate-300 py-10 col-span-2 text-center">Database is empty.</p>}
                </div>
            </Card>
          </div>
        )}

        {/* --- USERS SECTION --- */}
        {activeTab === "users" && (
          <div className="max-w-5xl space-y-10 animate-in fade-in duration-500 mx-auto">
            <Card className="p-8 lg:p-12 rounded-[3.5rem] border-none shadow-xl bg-white">
              <h3 className="text-2xl font-black italic uppercase mb-8 tracking-tighter text-blue-600">User Management</h3>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input placeholder="Full Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold" />
                <Input type="email" placeholder="Email Address" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold" />
                <Input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold" />
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold text-xs outline-none uppercase appearance-none cursor-pointer">
                  <option value="USER">Standard User</option>
                  <option value="ADMIN">System Admin</option>
                </select>
                <Button type="submit" className="md:col-span-2 h-16 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Add User to Database</Button>
              </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(u => (
                <Card key={u.id} className="p-6 flex justify-between items-center rounded-[2.2rem] border border-slate-50 shadow-sm bg-white hover:shadow-md transition-all">
                  <div className="overflow-hidden pr-4">
                    <p className="font-black text-slate-900 uppercase text-xs tracking-tighter truncate">{u.name} {u.role === 'ADMIN' && <span className="ml-2 text-[7px] bg-blue-600 text-white px-2 py-0.5 rounded-full tracking-normal">ROOT</span>}</p>
                    <p className="text-[9px] text-slate-400 font-bold truncate lowercase mt-1">{u.email}</p>
                  </div>
                  <Button onClick={() => handleDelete('/users', u.id, u.role)} variant="ghost" className="text-red-500 hover:bg-red-50 h-10 w-10 rounded-xl shrink-0"><GoTrash size={16}/></Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* --- FLIGHTS SECTION --- */}
        {activeTab === "flights" && (
          <div className="max-w-6xl space-y-10 animate-in fade-in duration-500 mx-auto">
            <Card className="p-8 lg:p-12 rounded-[3.5rem] border-none shadow-xl bg-white">
              <h3 className="text-2xl font-black italic uppercase mb-8 text-blue-600 tracking-tighter">Flight Deployment</h3>
              <form onSubmit={handleAddFlight} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Input placeholder="Origin" value={newFlight.origin} onChange={e => setNewFlight({...newFlight, origin: e.target.value})} required className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold" />
                <Input placeholder="Destination" value={newFlight.destination} onChange={e => setNewFlight({...newFlight, destination: e.target.value})} required className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold" />
                <Input type="number" placeholder="Price (PKR)" value={newFlight.price} onChange={e => setNewFlight({...newFlight, price: e.target.value})} required className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold" />
                <Input type="date" value={newFlight.date} onChange={e => setNewFlight({...newFlight, date: e.target.value})} required className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold text-[10px] uppercase appearance-none" />
                <Button type="submit" className="md:col-span-2 xl:col-span-4 h-16 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-100">Synchronize Route</Button>
              </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {flights.map(f => (
                <Card key={f.id} className="bg-white border border-slate-100 p-8 rounded-[2.8rem] shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-500"><GoLocation size={70}/></div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 italic tracking-[0.2em]">FLT-{f.id}</p>
                  <h4 className="text-2xl font-black italic uppercase text-slate-900 mb-6 leading-none">{f.origin} <br/><span className="text-blue-600">/ {f.destination}</span></h4>
                  <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Fixed Rate</p>
                        <p className="text-xl font-black text-slate-900 italic tracking-tighter">Rs {f.price.toLocaleString()}</p>
                    </div>
                    <Button onClick={() => handleDelete('/flights', f.id)} variant="ghost" className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white h-12 w-12 rounded-xl transition-all shrink-0"><GoTrash size={18} /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* --- MESSAGES SECTION --- */}
        {activeTab === "messages" && (
          <div className="max-w-4xl space-y-6 animate-in fade-in duration-500 mx-auto">
            <h2 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter mb-10">User <span className="text-blue-600">Mailbox.</span></h2>
            {inquiries.length > 0 ? inquiries.slice().reverse().map(iq => (
              <Card key={iq.id} className="p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm bg-white hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="overflow-hidden pr-4">
                    <h4 className="text-xl font-black italic uppercase text-slate-900 truncate tracking-tight">{iq.name}</h4>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest truncate mt-1">{iq.email}</p>
                  </div>
                  <Button onClick={() => handleDelete('/inquiries', iq.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white h-12 w-12 rounded-xl transition-all shrink-0"><GoTrash size={18}/></Button>
                </div>
                <div className="bg-slate-50 p-6 rounded-[1.5rem] font-bold text-slate-600 text-sm leading-relaxed italic border border-slate-100">"{iq.message}"</div>
              </Card>
            )) : <p className="text-center py-20 text-[10px] uppercase font-black tracking-widest text-slate-400">Mailbox is empty.</p>}
          </div>
        )}

      </main>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" />}
    </div>
  );
}

function SidebarTab({ id, label, icon, activeTab, setActiveTab, setSidebarOpen }) {
    return (
        <button onClick={() => {setActiveTab(id); setSidebarOpen(false);}}
            className={`w-full flex items-center gap-4 h-15 p-4 rounded-[1.2rem] transition-all font-black text-[10px] uppercase tracking-[0.2em] ${activeTab === id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
            <span className="text-lg">{icon}</span> {label}
        </button>
    );
}

function StatCard({ title, value, icon, desc, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    slate: "bg-slate-100 text-slate-900"
  };
  
  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 group hover:scale-[1.02] transition-transform">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 shadow-inner ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
      <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 truncate">{value}</h3>
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-5 border-t border-slate-50 pt-4 truncate italic">{desc}</p>
    </Card>
  );
}
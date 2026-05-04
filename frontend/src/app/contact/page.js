"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // Agar shadcn use kar rahe hain
import { 
  GoMail, 
  GoPerson, 
  GoComment, 
  GoCheckCircle, 
  GoPaperAirplane,
  GoLocation,
  GoTrophy
} from "react-icons/go";
import { sendRequest } from "@/lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 👈 Aapke 'inquiries' controller se connection
      await sendRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("System Error: Inquiry could not be sent.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[3rem] p-12 text-center bg-white">
          <GoCheckCircle size={80} className="text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter mb-2">Message Sent!</h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-8">Admin Junaid will review your query soon.</p>
          <Button onClick={() => setSubmitted(false)} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest">Send Another</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] py-16 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* --- LEFT: INFO SECTION (5 COLS) --- */}
        <div className="lg:col-span-5 space-y-10 lg:mt-10">
          <header>
            <div className="flex items-center gap-2 text-blue-600 mb-4 font-black uppercase text-[10px] tracking-[0.4em]">
              <GoMail className="animate-pulse" /> Support Gateway
            </div>
            <h1 className="text-6xl lg:text-8xl font-black italic text-slate-900 uppercase tracking-tighter leading-none mb-6">
              Get in <br /> <span className="text-blue-600 underline decoration-8 decoration-blue-100 underline-offset-8">Touch.</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Aapki queries hamari priority hain. Form bharein aur hum foran rabta karenge.</p>
          </header>

          <div className="space-y-6">
            <InfoBox icon={<GoLocation />} title="Base of Ops" detail="Lahore, Pakistan" />
            <InfoBox icon={<GoTrophy />} title="Response Rate" detail="Under 2 Hours" />
          </div>
        </div>

        {/* --- RIGHT: FORM SECTION (7 COLS) --- */}
        <div className="lg:col-span-7">
          <Card className="border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] rounded-[3.5rem] bg-white overflow-hidden">
            <CardContent className="p-10 lg:p-16 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Name Field */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                  <div className="relative">
                    <GoPerson className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <Input 
                      required
                      placeholder="Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-16 rounded-2xl bg-slate-50 border-none pl-14 pr-6 font-bold text-sm focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                  <div className="relative">
                    <GoMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <Input 
                      required
                      type="email"
                      placeholder="admin@gmail.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-16 rounded-2xl bg-slate-50 border-none pl-14 pr-6 font-bold text-sm focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Inquiry Details</label>
                  <div className="relative">
                    <GoComment className="absolute left-6 top-6 text-slate-300" size={20} />
                    <Textarea 
                      required
                      placeholder="How can we help you?" 
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="rounded-2xl bg-slate-50 border-none pl-14 pr-6 py-6 font-bold text-sm focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-[10px] font-black uppercase ml-4">{error}</p>}

                <Button 
                  disabled={loading}
                  className="w-full h-20 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-[1.8rem] shadow-2xl transition-all active:scale-95 uppercase tracking-[0.3em] text-[11px] flex gap-3"
                >
                  {loading ? "Processing..." : <><GoPaperAirplane size={18}/> Deploy Inquiry</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// UI Small Component
function InfoBox({ icon, title, detail }) {
  return (
    <div className="flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="font-black text-slate-900 uppercase italic">{detail}</p>
      </div>
    </div>
  );
}
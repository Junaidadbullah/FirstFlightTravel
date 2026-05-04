"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { sendRequest } from "@/lib/api"; // Connection helper

function RegisterPage() {
  const router = useRouter();
  
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend ko bhejne ke liye "name" field ko combine kar rahe hain
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      };

      await sendRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      alert("Account created successfully! Login karein.");
      router.push('/login'); // Signup ke baad login page par bhejo
    } catch (err) {
      alert(err.message || "Registration fail ho gayi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 lg:p-10 font-sans text-slate-800">
      <Card className="w-full max-w-5xl border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-slate-900 flex flex-col lg:flex-row">
        
        {/* Left Side: Brand Info */}
        <div className="lg:w-[60%] p-12 lg:p-16 text-white flex flex-col justify-between relative">
          <div className="h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="w-40 h-1 bg-blue-600 mb-10 rounded-full"></div>
          <h2 className="text-5xl lg:text-6xl font-black mb-8 italic leading-[1.1] tracking-tighter text-white">
            Create Your <br />
            <span className="text-blue-500">Journey.</span>
          </h2>
          <p className="text-slate-400 leading-relaxed text-sm font-medium">
            Experience the future of travel booking designed by the{" "}
            <span className="text-white">
              Software Engineering Department at Superior.
            </span>
          </p>

          <div className="relative z-10 space-y-4 hidden lg:block">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Fully Responsive
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Secure Portal
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-grow bg-white p-10 lg:p-10 flex flex-col justify-center lg:rounded-l-[4rem]">
          <div className="mb-10">
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">
              Register
            </h3>
            <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-[0.2em]">
              Engineering Portal Access
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="FirstName"
                  required
                  className="h-14 bg-slate-50 border-none rounded-2xl px-5 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="last Name"
                  required
                  className="h-14 bg-slate-50 border-none rounded-2xl px-5 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="admin@gmail.com"
                required
                className="h-14 bg-slate-50 border-none rounded-2xl px-5 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                required
                className="h-14 bg-slate-50 border-none rounded-2xl px-5 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-10">
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white h-16 rounded-[1.5rem] font-black border-none shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                {loading ? "Processing..." : "Create Account"}
              </Button>
              <p className="text-center text-xs text-slate-400 mt-8 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 font-black hover:underline underline-offset-4">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
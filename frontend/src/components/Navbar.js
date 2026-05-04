"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Pathname check karne ke liye
import { Button } from "@/components/ui/button";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // 👈 Current page track karega
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("USER");

  // Authentication check logic
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "User");
      setUserRole(role || "USER");
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  // 1. Page change hotay hi ya mount hotay hi check karo
  useEffect(() => {
    checkAuth();
  }, [pathname]); // 👈 Jab bhi URL change hoga (e.g. login se dashboard), ye dobara check karega

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 lg:px-10 py-4 border-b bg-white sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <div className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer italic">
        <Link href="/">FF<span className="text-slate-900">.</span></Link>
      </div>
      
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
        <Link href="/flights" className="hover:text-blue-600 transition">Flights</Link>
        <Link href="/about" className="hover:text-blue-600 transition">About</Link>
        <Link href="/contact" className="hover:text-blue-600 transition">Contact Us</Link>
        
        {/* Logged in Dashboard Link */}
        {isLoggedIn && (
          <Link 
            href={userRole === 'ADMIN' ? "/dashboard/admin" : "/dashboard/profile"} 
            className="text-blue-600 border-l pl-6 hover:underline"
          >
            Go To Dashboard
          </Link>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* 👈 Condition: Agar logged in NAHI hai toh buttons dikhao */}
        {!isLoggedIn ? (
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-black uppercase text-[10px] tracking-widest">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.1em] px-6 rounded-xl shadow-lg border-none transition-all">
                Sign Up
              </Button>
            </Link>
          </div>
        ) : (
          /* 👈 Agar logged in hai toh User info aur logout dikhao */
          <div className="flex items-center gap-4 border-l pl-4 border-slate-100">
            <div className="hidden sm:flex flex-col items-end">
                <span className="text-[8px] font-black text-blue-500 uppercase leading-none mb-1">Active Session</span>
                <span className="text-xs font-black text-slate-900 uppercase">{userName}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="text-red-500 border-red-100 hover:bg-red-50 font-black uppercase text-[9px] px-4 rounded-xl transition-all"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
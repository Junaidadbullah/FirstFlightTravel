"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { GoMail, GoLock } from "react-icons/go"
import Link from "next/link"
import { sendRequest } from "@/lib/api"

function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // --- SAARA LOGIC IS FUNCTION KE ANDAR HONA CHAHIYE ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await sendRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // 1. App logic ke liye LocalStorage
      localStorage.setItem('token', data.access_token);
      
      // 2. Middleware ke liye Cookie set karna
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;

      console.log("User Role:", data.role);

      // 3. Redirect Logic
      if (data.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/profile');
      }

    } catch (err) {
      // Agar backend se error aaye (Unauthorized), toh yahan handle hoga
      alert("Login Fail: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
        <CardContent className="p-10 lg:p-14">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
              Welcome <span className="text-blue-600">Back.</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">FirstFlight Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <GoMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-16 bg-slate-50 border-none rounded-2xl pl-14 pr-6 focus:ring-2 focus:ring-blue-500 font-bold text-sm" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <GoLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-16 bg-slate-50 border-none rounded-2xl pl-14 pr-6 focus:ring-2 focus:ring-blue-500 font-bold text-sm" 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black h-16 rounded-2xl border-none shadow-xl transition-all active:scale-95 uppercase tracking-widest text-[11px]"
            >
              {loading ? "Verifying..." : "Sign In to System"}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <Link href="/signup" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
              Don't have an account? <span className="text-slate-900">Create One</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage;
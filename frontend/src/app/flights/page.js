"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GoArrowRight, GoShieldCheck } from "react-icons/go"
import { sendRequest } from "@/lib/api"
import { useRouter } from "next/navigation"

function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const data = await sendRequest('/flights');
        setFlights(data);
      } catch (error) {
        console.error("Flights fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  // --- DIRECT REDIRECT LOGIC (No Banner/Alert) ---
  const handleBookingClick = (flightId) => {
    const token = localStorage.getItem('token');
    
    // Agar token nahi hai, toh bina alert ke seedha login par bhej do
    if (!token || token === "undefined" || token === "null") {
      router.push('/login');
    } else {
      router.push(`/booking?flightId=${flightId}`); 
    }
  };

  const getCode = (city) => city ? city.substring(0, 3).toUpperCase() : "FLI";

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <GoShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Verified Inventory</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black italic text-slate-900 tracking-tighter uppercase leading-none">
            Browse <span className="text-blue-600">Flights.</span>
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-20 font-black uppercase text-slate-400 animate-pulse tracking-widest">Updating...</div>
        ) : (
          <div className="space-y-6">
            {flights.map((flight) => (
              <Card key={flight.id} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row items-stretch">
                    
                    {/* Route Details */}
                    <div className="flex-1 p-10 lg:p-14 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Origin</p>
                        <h3 className="text-3xl lg:text-5xl font-black text-slate-900">{getCode(flight.origin)}</h3>
                        <p className="text-sm text-slate-400 font-bold italic">{flight.origin}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Destination</p>
                        <h3 className="text-3xl lg:text-5xl font-black text-slate-900">{getCode(flight.destination)}</h3>
                        <p className="text-sm text-slate-400 font-bold italic">{flight.destination}</p>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="w-full lg:w-80 bg-slate-900 p-10 flex flex-col items-center justify-center space-y-6">
                      <p className="text-3xl font-black text-white italic tracking-tighter">Rs {flight.price?.toLocaleString()}</p>
                      
                      {/* 
                         - cursor-pointer: Hath banane ke liye
                         - relative z-20: Taake click block na ho
                      */}
                      <Button 
                        onClick={() => handleBookingClick(flight.id)}
                        type="button"
                        className="w-full bg-blue-600 hover:bg-white hover:text-slate-900 text-white font-black h-14 rounded-2xl border-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] !cursor-pointer relative z-20"
                      >
                        Book Now <GoArrowRight />
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FlightsPage;
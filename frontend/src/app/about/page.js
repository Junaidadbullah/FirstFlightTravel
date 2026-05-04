"use client"
import { Card, CardContent } from "@/components/ui/card"
import { GoOrganization, GoRocket, GoShieldCheck, GoMilestone, GoMortarBoard } from "react-icons/go"

function AboutPage() {
 

  return (
    <div className="min-h-screen bg-sky-100 font-sans text-slate-800">
      
      {/* Section 1: The Narrative (Home se different styling) */}
      <section className="pt-10 lg:pt-20 px-6 max-w-5xl mx-auto">
        <h4 className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 text-center lg:text-left">Our Identity</h4>
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight mb-8 text-center lg:text-left">
          Crafting Digital Journeys at <span className="italic text-blue-600">University of Lahore</span>
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-slate-500 text-sm lg:text-base leading-relaxed">
          <p>
            FirstFlightTravel is not just a portal; it is a manifestation of modern software engineering principles. Developed within the academic halls of UOL, our project bridges the gap between complex travel logistics and user-centric design.
          </p>
          <p>
            Under the specialized mentorship of Sir Ali Ahmed, our team has integrated high-performance architecture to ensure that every booking is processed with enterprise-grade precision.
          </p>
        </div>
      </section>

      {/* Section 3: Values with Icons */}
      <section className=" max-w-7xl mx-auto py-24 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-12 bg-slate-50 rounded-[3rem] border border-transparent hover:border-blue-200 transition-all">
            <GoMortarBoard size={40} className="text-blue-600 mb-6" />
            <h3 className="text-xl font-bold mb-4 italic">Academic Root</h3>
            <p className="text-sm text-slate-500 leading-loose">Built as a core project for Technopreneurship, focusing on scalable business models and efficient code.</p>
          </div>
          <div className="p-12 bg-slate-50 rounded-[3rem] border border-transparent hover:border-blue-200 transition-all">
            <GoMilestone size={40} className="text-blue-600 mb-6" />
            <h3 className="text-xl font-bold mb-4 italic">Development Goal</h3>
            <p className="text-sm text-slate-500 leading-loose">Our primary objective is to provide a real-world solution for the travel industry using Next.js and NestJS.</p>
          </div>
          <div className="p-12 bg-slate-50 rounded-[3rem] border border-transparent hover:border-blue-200 transition-all sm:col-span-2 lg:col-span-1">
            <GoShieldCheck size={40} className="text-blue-600 mb-6" />
            <h3 className="text-xl font-bold mb-4 italic">Reliability</h3>
            <p className="text-sm text-slate-500 leading-loose">Ensuring that user data and flight information maintain 100% integrity across the platform.</p>
          </div>
        </div>
      </section>

     

    </div>
  );
}

export default AboutPage;
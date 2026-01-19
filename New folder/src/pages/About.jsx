
import React from 'react'
import { Shield, Users, Clock, Award } from 'lucide-react'

const About = () => {
    return (
        <div className="pb-20">
            <div className="bg-navy py-24 text-center">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                        <img
                            src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=800"
                            alt="Sri Lanka Coast"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-navy/20"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-navy">Premium</h3>
                        <p className="text-xs text-gray-400">Vip Fleet</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About

import React from 'react'
import BookingForm from '../components/BookingForm'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'

const Contact = () => {
    return (
        <div className="pb-20">
            <div className="bg-navy py-24">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center text-white">
                    <div>
                        <h1 className="text-5xl font-extrabold mb-6">Let's Talk <span className="text-gold">Travel</span></h1>
                        <p className="text-white/60 text-lg mb-10 leading-relaxed">
                            Have questions about our tours or need a specific vehicle? Our team is available 24/7 to assist with your Sri Lankan journey.
                        </p>
                        <div className="space-y-8">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-white/40 uppercase tracking-widest">Hot Line</p>
                                    <p className="text-xl font-bold">0722 885 885</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-white/40 uppercase tracking-widest">WhatsApp</p>
                                    <p className="text-xl font-bold">0716 885 880</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-white/40 uppercase tracking-widest">Email Us</p>
                                    <p className="text-xl font-bold">airporttaxis.lk@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-white/40 uppercase tracking-widest">Our Office</p>
                                    <p className="text-lg font-bold">118/5 St. Joseph Street, Grandpass, Colombo 14</p>
                                    <p className="text-sm text-gold mt-1">Reg No: PV 00342552</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl">
                        <BookingForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact

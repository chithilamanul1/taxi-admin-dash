import React from 'react'
import BookingForm from '../BookingForm'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'

const Contact = () => {
    return (
        <div className="pb-20 dark:bg-emerald-900 transition-colors">
            <div className="bg-emerald-900 py-24">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center text-white">
                    <div>
                        <h1 className="text-5xl font-extrabold mb-6">Let's Talk <span className="text-emerald-600 dark:text-emerald-400">Travel</span></h1>
                        <p className="text-white/60 dark:text-white/70 text-lg mb-10 leading-relaxed">
                            Have questions about our tours or need a specific vehicle? Our team is available 24/7 to assist with your Sri Lankan journey.
                        </p>
                        <div className="space-y-8">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-600">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-white/40 uppercase tracking-widest">Hot Line</p>
                                    <p className="text-lg font-bold leading-tight">0716 885 880</p>
                                    <p className="text-sm text-emerald-600/60 leading-tight">Official Support</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-600">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-white/40 uppercase tracking-widest">WhatsApp</p>
                                    <p className="text-xl font-bold">+94 71 688 5880</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-600">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-white/40 uppercase tracking-widest">Email Us</p>
                                    <p className="text-xl font-bold">info@srilankantaxi.lk</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-600">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-white/40 dark:text-white/60 uppercase tracking-widest">Our Office</p>
                                    <p className="text-lg font-bold">118/5 St. Joseph Street, Grandpass, Colombo 14, Sri Lanka</p>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Reg No: PV 00342552</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-emerald-900 p-2 rounded-[2.5rem] shadow-2xl border border-white/5 transition-colors overflow-hidden">
                        <div className="h-[450px] w-full rounded-[2.1rem] overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.673892850937!2d79.86650467576569!3d6.93883701768822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259166f034f59%3A0x673199c0800b467d!2s118%2F5%20St%20Joseph's%20St%2C%20Colombo!5e0!3m2!1sen!2slk!4v1712557200000!5m2!1sen!2slk"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Airport Taxis Sri Lanka Office"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact

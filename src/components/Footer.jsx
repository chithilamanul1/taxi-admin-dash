import React from 'react'

const Footer = () => {
    return (
        <footer id="contact" className="bg-slate-900 text-white py-20">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="relative h-14 overflow-hidden flex items-start mb-8">
                        <img
                            src="/logo.png"
                            alt="AirportTaxi.lk"
                            className="h-[140%] w-auto object-contain object-top filter brightness-0 invert"
                        />
                    </div>
                    <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                        AirportTaxis.lk is Sri Lanka's leading airport transfer service, professionalized to serve international travelers with excellence and safety.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                        </a>
                        <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-xl font-bold mb-8">Quick Links</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><a href="#" className="hover:text-gold transition-all">Home</a></li>
                        <li><a href="#tours" className="hover:text-gold transition-all">Tour Packages</a></li>
                        <li><a href="#booking-section" className="hover:text-gold transition-all">Book a Taxi</a></li>
                        <li><a href="#" className="hover:text-gold transition-all">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xl font-bold mb-8">Contact Info</h4>
                    <ul className="space-y-6 text-gray-400">
                        <li className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span>118/5 St. Joseph Street, Grandpass, Colombo 14.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <span>Reg No: PV 00342552</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            <span>Hotline: 0722 885 885</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            <span>WhatsApp: 0716 885 880</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 012 2v-5a2 2 0 01-2-2H5a2 2 0 01-2 2v5a2 2 0 012 2z"></path></svg>
                            <span>airporttaxis.lk@gmail.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 pt-16 mt-16 border-t border-white/10 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <p>&copy; 2026 AirportTaxi.lk. All rights reserved.</p>
                <p>
                    Designed & Developed by <a href="https://seranex.org" target="_blank" rel="noopener noreferrer" className="text-gold font-bold hover:underline">Chithila Manul</a> | Seranex.org
                </p>
            </div>
        </footer>
    )
}

export default Footer

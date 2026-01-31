'use client'

import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const BookingForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        arrivalDate: new Date(),
        flightNumber: '',
        passengers: '1',
        destination: '',
        notes: '',
        boardShow: false,
        boardName: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleDateChange = (date) => {
        setFormData({ ...formData, arrivalDate: date })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formattedDate = formData.arrivalDate.toLocaleDateString()
        const formattedTime = formData.arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        // Board Show Details
        const boardInfo = formData.boardShow
            ? `\nBoard Show (Meet & Greet): YES (+Rs 2000)\nName on Board: ${formData.boardName}`
            : `\nBoard Show: NO`

        const subject = `New Booking Request - ${formData.name}`
        const messageBody = `
New Booking Request

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Flight Number: ${formData.flightNumber}
Arrival Date: ${formattedDate}
Arrival Time: ${formattedTime}
Passengers: ${formData.passengers}
Destination: ${formData.destination}
Notes: ${formData.notes}
${boardInfo}
        `.trim()

        try {
            // Email disabled for testing
            // await fetch("https://formsubmit.co/ajax/info@airporttaxi.lk", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Accept": "application/json"
            //     },
            //     body: JSON.stringify({
            //         _subject: subject,
            //         _captcha: "false",
            //         _template: "table",
            //         name: formData.name,
            //         email: formData.email,
            //         phone: formData.phone,
            //         flight_number: formData.flightNumber,
            //         arrival_date: formattedDate,
            //         arrival_time: formattedTime,
            //         passengers: formData.passengers,
            //         destination: formData.destination,
            //         notes: formData.notes,
            //         board_show: formData.boardShow ? 'Yes (+2000 LKR)' : 'No',
            //         name_on_board: formData.boardName || 'N/A'
            //     })
            // });
            console.log("Email submission disabled for testing");
        } catch (error) {
            console.error("Email submission failed:", error)
        } finally {
            // const waBody = `New Booking Request:%0D%0AName: ${formData.name}%0D%0AFlight Number: ${formData.flightNumber}%0D%0AArrival Date: ${formattedDate}%0D%0AArrival Time: ${formattedTime}%0D%0APassengers: ${formData.passengers}%0D%0ADestination: ${formData.destination}%0D%0A%0D%0A${formData.boardShow ? `Board Show: YES (Name: ${formData.boardName})%0D%0A` : ''}%0D%0ASent from AirportTaxi.lk`
            // window.location.href = `https://wa.me/94716885880?text=${waBody}`
            alert("Booking request simulated (Email & WhatsApp disabled for testing)");
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-10 rounded-[2.5rem] border border-emerald-900/10 shadow-2xl bg-white text-emerald-900 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Row 1 */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                    <input
                        required
                        type="text" name="name" value={formData.name} onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-emerald-900/20 outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                    <input
                        required
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-emerald-900/20 outline-none transition-all"
                    />
                </div>

                {/* Row 2 */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Phone / WhatsApp</label>
                    <input
                        required
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        placeholder="+1 234 567 890"
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-emerald-900/20 outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Flight Number</label>
                    <input
                        required
                        type="text" name="flightNumber" value={formData.flightNumber} onChange={handleChange}
                        placeholder="EK 650"
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-emerald-900/20 outline-none transition-all uppercase"
                    />
                </div>

                {/* Row 3 - Date Picker */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Arrival Date & Time</label>
                    <DatePicker
                        selected={formData.arrivalDate}
                        onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-emerald-900/20 outline-none transition-all cursor-pointer"
                        wrapperClassName="w-full"
                    />
                </div>

                {/* Row 4 */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Passengers</label>
                    <select
                        name="passengers" value={formData.passengers} onChange={handleChange}
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-emerald-900/20 outline-none transition-all"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                        <option value="9+">9+ Group</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Drop-off Destination</label>
                    <input
                        required
                        type="text" name="destination" value={formData.destination} onChange={handleChange}
                        placeholder="Galle, Colombo, etc."
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-emerald-900/20 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Board Show Toggle */}
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="https://cdn-icons-png.flaticon.com/512/3284/3284646.png" alt="Board" className="h-10 w-10 opacity-70" />
                        <div>
                            <h4 className="font-bold text-emerald-900 text-lg">Airport Greeting (Board Show)</h4>
                            <p className="text-xs text-gray-500">Our driver will wait for you with a name board.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-emerald-600 text-sm">+ Rs 2000.00</span>
                        <label className="relative inline-flex items-center cursor-pointer mt-1">
                            <input
                                type="checkbox"
                                name="boardShow"
                                checked={formData.boardShow}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-900"></div>
                        </label>
                    </div>
                </div>

                {formData.boardShow && (
                    <div className="mt-4 animate-fade-in">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Name to Display on Board</label>
                        <input
                            required
                            type="text"
                            name="boardName"
                            value={formData.boardName}
                            onChange={handleChange}
                            placeholder="e.g. Mr. John Doe"
                            className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-900/20 outline-none text-sm"
                        />
                    </div>
                )}
            </div>

            <div className="mt-8 space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Extra Notes / Luggage Info</label>
                <textarea
                    name="notes" value={formData.notes} onChange={handleChange}
                    rows="3"
                    placeholder="Any special requests or large luggage?"
                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-emerald-900/20 outline-none transition-all resize-none"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-10 w-full bg-emerald-900 text-white font-extrabold text-xl py-5 rounded-2xl shadow-xl hover:bg-emerald-800 hover:scale-[1.01] transition-all disabled:opacity-70 disabled:grayscale"
            >
                {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
            </button>
            <p className="text-center text-gray-400 text-sm mt-4">
                Our agent will contact you on WhatsApp/Email instantly after submission.
            </p>
        </form>
    )
}

export default BookingForm

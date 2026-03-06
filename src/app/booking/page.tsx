"use client";

import React, { useState } from 'react';
import { MapPin, Plane, Car, ArrowRight, CheckCircle2, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { FLEET } from '@/lib/mock-taxi-db';

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        pickup: '',
        dropoff: '',
        date: '',
        vehicle: '',
        passengers: 1,
        stops: [] as string[]
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const vehicleOptions = FLEET.map(v => ({
        label: `${v.name} - Max ${v.capacity} Pax`,
        value: v.id
    }));

    const selectedVehicle = FLEET.find(v => v.id === formData.vehicle);

    return (
        <div className="min-h-screen bg-[#050b18] text-white pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Stepper */}
                <div className="flex justify-between items-center mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 -z-10" />
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-emerald-600 text-black scale-110 shadow-[0_0_20px_rgba(5,150,105,0.3)]' : 'bg-slate-800 text-gray-500'
                                }`}
                        >
                            {step > s ? <CheckCircle2 size={24} /> : s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <CardHeader className="text-center border-b border-white/5">
                        <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            {step === 1 && "Plan Your Journey"}
                            {step === 2 && "Select Your Ride"}
                            {step === 3 && "Booking Summary"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1 && "Provide your pickup and destination details"}
                            {step === 2 && "Choose the vehicle that suits your needs"}
                            {step === 3 && "Review and confirm your airport transfer"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="py-10">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Pickup Location"
                                        placeholder="e.g. Bandaranaike International Airport"
                                        icon={<Plane size={18} />}
                                        value={formData.pickup}
                                        onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                                    />
                                    <Input
                                        label="Dropoff Location"
                                        placeholder="e.g. Taj Samudra, Colombo"
                                        icon={<MapPin size={18} />}
                                        value={formData.dropoff}
                                        onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
                                    />
                                </div>

                                <div className="bg-white/5 p-4 rounded-xl border border-dashed border-white/10 flex items-center justify-center gap-2 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer group">
                                    <Navigation size={18} className="group-hover:animate-pulse" />
                                    <span className="text-sm">Add a waypoint (Stopover)</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <DatePicker
                                        label="Pickup Date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                    <Select
                                        label="Passengers"
                                        options={[
                                            { label: '1 Passenger', value: 1 },
                                            { label: '2 Passengers', value: 2 },
                                            { label: '3-4 Passengers', value: 4 },
                                            { label: '5-8 Passengers', value: 8 },
                                        ]}
                                        value={formData.passengers}
                                        onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {FLEET.map((vehicle) => (
                                        <div
                                            key={vehicle.id}
                                            onClick={() => setFormData({ ...formData, vehicle: vehicle.id })}
                                            className={`
                        p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group
                        ${formData.vehicle === vehicle.id
                                                    ? 'border-emerald-600 bg-emerald-600/5 ring-1 ring-emerald-600 shadow-[0_0_30px_rgba(5,150,105,0.1)]'
                                                    : 'border-white/10 bg-white/5 hover:border-white/30'}
                      `}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-lg">{vehicle.name}</h4>
                                                    <p className="text-sm text-gray-400">{vehicle.type}</p>
                                                </div>
                                                <Car size={24} className={formData.vehicle === vehicle.id ? 'text-emerald-600' : 'text-gray-600'} />
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Per KM Rate</p>
                                                    <p className="text-xl font-bold text-white">LKR {vehicle.ratePerKm}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Capacity</p>
                                                    <p className="font-medium text-gray-300">{vehicle.capacity} Pax</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8">
                                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <CheckCircle2 size={120} />
                                    </div>
                                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <CheckCircle2 className="text-green-500" />
                                        Trip Confirmation
                                    </h4>

                                    <div className="space-y-4">
                                        <div className="flex justify-between py-3 border-b border-white/5">
                                            <span className="text-gray-400 text-sm">Pickup</span>
                                            <span className="font-medium">{formData.pickup}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-white/5">
                                            <span className="text-gray-400 text-sm">Destination</span>
                                            <span className="font-medium">{formData.dropoff}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-white/5">
                                            <span className="text-gray-400 text-sm">Date</span>
                                            <span className="font-medium">{formData.date}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-white/5">
                                            <span className="text-gray-400 text-sm">Selected Ride</span>
                                            <span className="font-medium text-emerald-600">{selectedVehicle?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-6">
                                            <span className="text-xl font-bold">Estimated Total</span>
                                            <span className="text-3xl font-black text-emerald-600">LKR 12,500</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200/80 text-sm">
                                    <strong>Note:</strong> Final price may vary based on actual distance and waiting time.
                                    A professional English-speaking driver will be assigned 1 hour before pickup.
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between gap-4">
                        {step > 1 && (
                            <button
                                onClick={prevStep}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 font-bold transition-all"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={step === 3 ? () => alert('Booking Shared with Dispatcher!') : nextStep}
                            className={`
                flex-1 px-8 py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2
                ${step === 3
                                    ? 'bg-gradient-to-r from-gold to-yellow-600 text-black shadow-lg shadow-gold/20'
                                    : 'bg-white text-black hover:bg-gray-200'}
              `}
                            disabled={step === 1 && (!formData.pickup || !formData.dropoff)}
                        >
                            {step === 1 && "Choose Vehicle"}
                            {step === 2 && "Review Summary"}
                            {step === 3 && "Confirm Booking"}
                            <ArrowRight size={20} />
                        </button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

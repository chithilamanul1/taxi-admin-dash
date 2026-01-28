'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check, ChevronRight, ChevronLeft, Loader2, Car, CreditCard, User, ShieldCheck } from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Vehicle Details', icon: Car },
    { id: 3, title: 'Documents', icon: ShieldCheck },
    { id: 4, title: 'Bank Info', icon: CreditCard },
];

export const metadata = {
    title: 'Driver Registration | Airport Taxi Tours Sri Lanka',
    description: 'Join our premium fleet of drivers. Register now to start accepting airport transfer bookings and city tours. Best rates and consistent work.',
    robots: {
        index: true,
        follow: true
    }
}

export default function DriverRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', password: '', address: '', nic: '',
        vehicleType: 'Car', vehicleModel: '', vehicleNumber: '', vehicleYear: '',
        bankName: '', branch: '', accountNumber: '', accountName: '',
        documents: { licenseFront: null, licenseBack: null, nicFront: null, nicBack: null }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, docName) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, verify size/type here
            setFormData(prev => ({
                ...prev,
                documents: { ...prev.documents, [docName]: file }
            }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Upload images first (Mocking Cloudinary upload for now)
            // In production: Use FormData to send files to an upload API endpoint

            const payload = {
                ...formData,
                // Converting file objects to base64 or placeholder URLs for this demo
                // Ideally, upload to S3/Cloudinary and send URLs
                documents: {
                    licenseFront: 'https://placehold.co/600x400?text=License+Front',
                    licenseBack: 'https://placehold.co/600x400?text=License+Back',
                    nicFront: 'https://placehold.co/600x400?text=NIC+Front',
                    nicBack: 'https://placehold.co/600x400?text=NIC+Back',
                }
            };

            const res = await fetch('/api/driver/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                router.push('/driver/register/success');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
            <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-8 pb-4 border-b border-slate-800">
                    <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight mb-2">Driver <span className="text-amber-400">Registration</span></h1>
                    <p className="text-slate-400 text-sm">Join the elite fleet of Airport Taxi drivers.</p>
                </div>

                {/* Progress */}
                <div className="px-8 py-6 bg-slate-900/50">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
                        <div className={`absolute left-0 top-1/2 h-1 bg-amber-500 -z-10 rounded-full transition-all duration-500`} style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}></div>
                        {STEPS.map((s) => (
                            <div key={s.id} className={`flex flex-col items-center gap-2 ${step >= s.id ? 'text-amber-400' : 'text-slate-600'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${step >= s.id ? 'bg-slate-900 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-slate-900 border-slate-700'}`}>
                                    <s.icon size={18} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <User className="text-amber-400" size={20} /> Personal Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="As per NIC" />
                                <Input label="NIC Number" name="nic" value={formData.nic} onChange={handleInputChange} placeholder="Old/New Format" />
                                <Input label="WhatsApp Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+94 77 ..." />
                                <Input label="Email Address" name="email" value={formData.email} onChange={handleInputChange} placeholder="For notifications" />
                                <div className="md:col-span-2">
                                    <Input label="Residential Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Full permanent address" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <Car className="text-amber-400" size={20} /> Vehicle Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vehicle Type</label>
                                    <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} className="w-full h-12 bg-slate-800 border border-slate-700 px-4 rounded-xl outline-none focus:border-amber-400 text-slate-100 text-sm font-bold">
                                        <option value="Mini Car">Mini Car (Alto/Kwid)</option>
                                        <option value="Car">Sedan (Axio/Prius)</option>
                                        <option value="Minivan">Minivan (KDH/Caravan)</option>
                                        <option value="Van">Large Van</option>
                                    </select>
                                </div>
                                <Input label="Vehicle Model" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} placeholder="e.g. Toyota Prius" />
                                <Input label="Plate Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} placeholder="CAB-XXXX" />
                                <Input label="Manufacture Year" name="vehicleYear" value={formData.vehicleYear} onChange={handleInputChange} placeholder="2018" />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <ShieldCheck className="text-amber-400" size={20} /> Required Documents
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FileUpload label="Driver License (Front)" id="licenseFront" onChange={(e) => handleFileChange(e, 'licenseFront')} file={formData.documents.licenseFront} />
                                <FileUpload label="Driver License (Back)" id="licenseBack" onChange={(e) => handleFileChange(e, 'licenseBack')} file={formData.documents.licenseBack} />
                                <FileUpload label="NIC (Front)" id="nicFront" onChange={(e) => handleFileChange(e, 'nicFront')} file={formData.documents.nicFront} />
                                <FileUpload label="NIC (Back)" id="nicBack" onChange={(e) => handleFileChange(e, 'nicBack')} file={formData.documents.nicBack} />
                            </div>
                            <div className="bg-amber-900/20 border border-amber-500/20 p-4 rounded-xl flex gap-3 items-start">
                                <div className="mt-1"><ShieldCheck size={16} className="text-amber-400" /></div>
                                <p className="text-xs text-amber-200/80 leading-relaxed">
                                    Your data is encrypted and securely stored. Documents are used strictly for verification purposes by our admin team.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <CreditCard className="text-amber-400" size={20} /> Bank Details
                            </h3>
                            <p className="text-xs text-slate-500">Used for weekly payouts of card payments.</p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="e.g. Sampath Bank" />
                                <Input label="Branch" name="branch" value={formData.branch} onChange={handleInputChange} placeholder="e.g. Colombo 07" />
                                <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="XXXXXXXXXX" />
                                <Input label="Account Holder" name="accountName" value={formData.accountName} onChange={handleInputChange} placeholder="Name as in passbook" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-8 pt-6 border-t border-slate-800 flex justify-between">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors"
                    >
                        <ChevronLeft size={16} /> <span className="hidden md:inline">{step === 1 ? 'Cancel' : 'Back'}</span>
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-sm font-black uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-black uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                            Submit Application
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Reusable Components
const Input = ({ label, name, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full h-12 bg-slate-800 border border-slate-700 px-4 rounded-xl outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 text-slate-100 text-sm font-bold placeholder:text-slate-600 transition-all"
            placeholder={placeholder}
        />
    </div>
);

const FileUpload = ({ label, id, onChange, file }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>
        <label htmlFor={id} className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-700/50'}`}>
            {file ? (
                <div className="text-center">
                    <Check className="mx-auto text-emerald-500 mb-2" size={24} />
                    <span className="text-xs font-bold text-emerald-400 block">{file.name.substring(0, 15)}...</span>
                </div>
            ) : (
                <div className="text-center text-slate-500">
                    <Upload className="mx-auto mb-2 opacity-50" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Click to Upload</span>
                </div>
            )}
            <input type="file" id={id} className="hidden" onChange={onChange} accept="image/*,application/pdf" />
        </label>
    </div>
);

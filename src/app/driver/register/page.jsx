'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check, ChevronRight, ChevronLeft, Loader2, Car, CreditCard, User, ShieldCheck, X } from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Vehicle Details', icon: Car },
    { id: 3, title: 'Documents', icon: ShieldCheck },
    { id: 4, title: 'Bank Info', icon: CreditCard },
    { id: 5, title: 'Initial Payment', icon: CreditCard },
];

// Metadata removed to fix "use client" error



export default function DriverRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', password: '', address: '', nic: '',
        vehicleType: 'Car', vehicleModel: '', vehicleNumber: '', vehicleYear: '',
        bankName: '', branch: '', accountNumber: '', accountName: '',
        initialDepositAmount: '5000', initialDepositReceipt: null,
        documents: { licenseFront: null, licenseBack: null, nicFront: null, nicBack: null }
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleFileChange = (e, field, isDoc = true) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => {
                const newData = isDoc
                    ? { ...prev, documents: { ...prev.documents, [field]: file } }
                    : { ...prev, [field]: file };
                return newData;
            });
            if (error) setError(null);
        }
    };

    const uploadFile = async (file, type) => {
        if (!file) return null;
        const data = new FormData();
        data.append('file', file);
        data.append('folder', 'drivers');

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: data
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Upload failed');
        }

        const result = await res.json();
        return result.success ? result.url : null;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Upload images
            const licenseFrontPath = await uploadFile(formData.documents.licenseFront, 'license-front');
            const licenseBackPath = await uploadFile(formData.documents.licenseBack, 'license-back');
            const nicFrontPath = await uploadFile(formData.documents.nicFront, 'nic-front');
            const nicBackPath = await uploadFile(formData.documents.nicBack, 'nic-back');
            const depositReceiptPath = await uploadFile(formData.initialDepositReceipt, 'deposit-receipt');

            // 2. Prepare payload
            const payload = {
                ...formData,
                documents: {
                    licenseFront: licenseFrontPath || '',
                    licenseBack: licenseBackPath || '',
                    nicFront: nicFrontPath || '',
                    nicBack: nicBackPath || '',
                },
                initialDeposit: {
                    amount: Number(formData.initialDepositAmount),
                    receipt: depositReceiptPath || ''
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
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-black">
            <div className="bg-emerald-900 rounded-[2rem] border border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-8 pb-4 border-b border-slate-800">
                    <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight mb-2">Driver <span className="text-emerald-400">Registration</span></h1>
                    <p className="text-slate-400 text-sm">Join the elite fleet of Airport Taxis drivers.</p>
                </div>

                {/* Progress */}
                <div className="px-8 py-6 bg-emerald-900/50">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
                        <div className={`absolute left-0 top-1/2 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-500`} style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}></div>
                        {STEPS.map((s) => (
                            <div key={s.id} className={`flex flex-col items-center gap-2 ${step >= s.id ? 'text-emerald-400' : 'text-slate-600'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${step >= s.id ? 'bg-emerald-900 border-emerald-500 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-emerald-900 border-slate-700'}`}>
                                    <s.icon size={18} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mx-8 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-shake">
                        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0">
                            <X className="text-red-500" size={16} />
                        </div>
                        <p className="text-sm font-bold text-red-500">{error}</p>
                    </div>
                )}

                {/* Form Content */}
                <div className="p-8 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <User className="text-emerald-400" size={20} /> Personal Information
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
                                <Car className="text-emerald-400" size={20} /> Vehicle Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vehicle Type</label>
                                    <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} className="w-full h-12 bg-slate-800 border border-slate-700 px-4 rounded-xl outline-none focus:border-emerald-400 text-slate-100 text-sm font-bold">
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
                                <ShieldCheck className="text-emerald-400" size={20} /> Required Documents
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FileUpload label="Driver License (Front)" id="licenseFront" onChange={(e) => handleFileChange(e, 'licenseFront')} file={formData.documents.licenseFront} />
                                <FileUpload label="Driver License (Back)" id="licenseBack" onChange={(e) => handleFileChange(e, 'licenseBack')} file={formData.documents.licenseBack} />
                                <FileUpload label="NIC (Front)" id="nicFront" onChange={(e) => handleFileChange(e, 'nicFront')} file={formData.documents.nicFront} />
                                <FileUpload label="NIC (Back)" id="nicBack" onChange={(e) => handleFileChange(e, 'nicBack')} file={formData.documents.nicBack} />
                            </div>
                            <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-xl flex gap-3 items-start">
                                <div className="mt-1"><ShieldCheck size={16} className="text-emerald-400" /></div>
                                <p className="text-xs text-emerald-200/80 leading-relaxed">
                                    Your data is encrypted and securely stored. Documents are used strictly for verification purposes by our admin team.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <CreditCard className="text-emerald-400" size={20} /> Bank Details
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

                    {step === 5 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <ShieldCheck className="text-emerald-400" size={20} /> Initial Payment
                            </h3>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                <p className="text-sm text-slate-400 mb-2 font-bold uppercase">Bank Transfer Details</p>
                                <div className="space-y-1 text-slate-200 font-mono text-sm uppercase">
                                    <p>Bank: <span className="text-emerald-400">Sampath Bank</span></p>
                                    <p>Account Name: <span className="text-emerald-400">AIRPORT TAXIS PVT LTD</span></p>
                                    <p>Account No: <span className="text-emerald-400 text-lg font-black tracking-widest">1127 1403 9751</span></p>
                                    <p>Branch: <span className="text-emerald-400">Grandpass</span></p>
                                </div>
                                <p className="text-xs text-slate-500 mt-4">Please transfer a minimum of <span className="text-slate-300 font-bold">Rs 5,000</span> to activate your account.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Input label="Amount Paid (LKR)" name="initialDepositAmount" value={formData.initialDepositAmount} onChange={handleInputChange} placeholder="5000" type="number" />
                                <FileUpload label="Payment Receipt" id="receipt" onChange={(e) => handleFileChange(e, 'initialDepositReceipt', false)} file={formData.initialDepositReceipt} />
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

                    {step < 5 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-900 rounded-xl text-sm font-black uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20"
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
            className="w-full h-12 bg-slate-800 border border-slate-700 px-4 rounded-xl outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 text-slate-100 text-sm font-bold placeholder:text-slate-600 transition-all"
            placeholder={placeholder}
        />
    </div>
);

const FileUpload = ({ label, id, onChange, file }) => {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (file && file instanceof File && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }, [file]);

    return (
        <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <input type="file" id={id} className="hidden" onChange={onChange} accept="image/*,.pdf" />
            <label htmlFor={id} className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-700/50'}`}>
                {preview ? (
                    <div className="relative w-full h-full">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/10">
                            <Check className="text-emerald-400 mb-1" size={24} />
                            <span className="text-[10px] font-black text-emerald-400 uppercase bg-emerald-900/80 px-2 py-0.5 rounded">Change File</span>
                        </div>
                    </div>
                ) : file ? (
                    <div className="text-center">
                        <Check className="mx-auto text-emerald-500 mb-2" size={24} />
                        <span className="text-xs font-bold text-emerald-400 block">{file.name.substring(0, 15)}...</span>
                        <span className="text-[10px] text-slate-500 uppercase mt-1 block">Click to change</span>
                    </div>
                ) : (
                    <div className="text-center group">
                        <Upload className="mx-auto text-slate-500 group-hover:text-emerald-500 transition-colors mb-2" size={24} />
                        <span className="text-xs font-black text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-tight">Upload File</span>
                    </div>
                )}
            </label>
        </div>
    );
};

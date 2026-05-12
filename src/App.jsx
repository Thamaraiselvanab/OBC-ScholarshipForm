import React, { useState, useEffect } from 'react';
import logo from './assets/cropped-cropped-WhatsApp_Image_2024-02-24_at_16.01.35_be4b5945-removebg-preview-1.png';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, MapPin, GraduationCap, FileText, 
  CheckCircle2, Loader2, ChevronRight, AlertCircle, Info, X,
  ShieldCheck, LogOut, Download, ExternalLink, Search, Filter, Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIG ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials missing! Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// --- COMPONENTS ---

const FormSection = ({ title, icon: Icon, children }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
      <Icon className="w-5 h-5 text-red-600" />
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const InputField = ({ label, name, icon: Icon, error, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
      <input
        name={name}
        className={`w-full bg-white border ${error ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3 ${Icon ? 'pl-12' : 'px-4'} pr-5 text-slate-900 focus:outline-none focus:border-red-500 transition-all`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-600 font-medium ml-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, icon: Icon, options, error, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />}
      <select
        name={name}
        className={`w-full bg-white border ${error ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3 ${Icon ? 'pl-12' : 'px-4'} pr-10 text-slate-900 focus:outline-none focus:border-red-500 transition-all appearance-none cursor-pointer`}
        {...props}
      >
        <option value="">Select Year</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
      </div>
    </div>
    {error && <p className="text-xs text-red-600 font-medium ml-1">{error}</p>}
  </div>
);

const CustomDatePicker = ({ label, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('days'); 
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleMonthClick = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setView('days');
  };

  const handleYearClick = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView('months');
  };

  const handleDayClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onChange(selectedDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const dayGrid = [];
  for (let i = 0; i < firstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear()); i++) {
    dayGrid.push(null);
  }
  for (let i = 1; i <= daysInMonth(currentDate.getMonth(), currentDate.getFullYear()); i++) {
    dayGrid.push(i);
  }

  const startYear = 1947;
  const years = Array.from({ length: 2025 - 1947 + 1 }, (_, i) => 2025 - i);

  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="space-y-2 relative">
      <label className="text-[13px] font-bold text-slate-700 ml-1 uppercase tracking-wider">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-4 bg-white border ${error ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3 px-4 text-left focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all shadow-sm`}
      >
        <Calendar className="w-5 h-5 text-red-600" />
        <span className={`font-medium ${value ? 'text-slate-900' : 'text-slate-400'}`}>
          {value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Select date of birth'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-2 w-full max-w-[320px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex gap-2">
                <button onClick={() => setView('months')} className="px-2 py-1 text-sm font-bold text-slate-900 hover:bg-slate-200 rounded-lg">
                  {MONTHS[currentDate.getMonth()]}
                </button>
                <button onClick={() => setView('years')} className="px-2 py-1 text-sm font-bold text-slate-900 hover:bg-slate-200 rounded-lg">
                  {currentDate.getFullYear()}
                </button>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-[300px] overflow-y-auto">
              {view === 'days' && (
                <div>
                  <div className="grid grid-cols-7 mb-2">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                      <div key={`day-header-${i}`} className="text-center text-[10px] font-black text-slate-400 uppercase">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {dayGrid.map((day, i) => (
                      <button
                        key={i} disabled={!day} onClick={() => handleDayClick(day)}
                        className={`h-9 w-9 text-sm rounded-lg transition-all ${!day ? 'invisible' : 'hover:bg-red-50 hover:text-red-600 text-slate-700'} ${selectedDate && day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear() ? 'bg-red-600 text-white font-bold' : ''}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {view === 'months' && (
                <div className="grid grid-cols-3 gap-2">
                  {MONTHS.map((m, i) => (
                    <button key={m} onClick={() => handleMonthClick(i)} className={`py-3 text-xs font-bold rounded-lg transition-all ${currentDate.getMonth() === i ? 'bg-red-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
                      {m.substring(0, 3)}
                    </button>
                  ))}
                </div>
              )}

              {view === 'years' && (
                <div className="grid grid-cols-4 gap-2">
                  {years.map(y => (
                    <button key={y} onClick={() => handleYearClick(y)} className={`py-3 text-xs font-bold rounded-lg transition-all ${currentDate.getFullYear() === y ? 'bg-red-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="text-xs text-red-600 ml-1 font-bold">{error}</p>}
    </div>
  );
};

// --- PAGES ---

const PublicForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', dob: '', 
    parents_name: '', parent_phone: '', address: '', 
    school: '', passed_out_year: ''
  });

  const [files, setFiles] = useState({ communityCertificate: null, incomeCertificate: null, bonofide: null });
  const [errors, setErrors] = useState({});
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const validateField = (name, value) => {
    if (!value || value.trim() === '') return 'Required';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email format';
    }
    if (name === 'phone' || name === 'parent_phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 10) return 'Must be exactly 10 digits';
    }
    return null;
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'phone' || name === 'parent_phone') value = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    if (name === 'phone') {
      setOtpSent(false);
      setIsOtpVerified(false);
      setOtpError('');
      setTimer(0);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      setErrors(prev => ({ ...prev, [field]: 'File exceeds 1MB' }));
      return;
    }
    setFiles(prev => ({ ...prev, [field]: file }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSendOTP = async () => {
    setOtpError('');
    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    const cleanEmail = formData.email.trim().toLowerCase();
    
    if (cleanPhone.length < 10) {
      setErrors(prev => ({ ...prev, phone: 'Enter a valid 10-digit number' }));
      return;
    }

    const emailError = validateField('email', cleanEmail);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }

    setIsSendingOtp(true);
    
    try {
      // Use the secure RPC function to check for duplicates bypassing RLS
      const { data: duplicateCheck, error: rpcError } = await supabase.rpc('check_duplicates', {
        p_phone: cleanPhone,
        p_email: cleanEmail
      });

      if (rpcError) {
        console.error('Duplicate Check Error:', rpcError);
        // Fallback or ignore if RPC fails
      } else if (duplicateCheck) {
        if (duplicateCheck.phone_exists) {
          setErrors(prev => ({ ...prev, phone: 'This mobile number is already registered' }));
          setIsSendingOtp(false);
          return;
        }
        if (duplicateCheck.email_exists) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
          setIsSendingOtp(false);
          return;
        }
      }

      const { error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: { phone: cleanPhone }
      });
      
      if (error) throw error;
      setOtpSent(true);
      setTimer(60); 
    } catch (err) {
      setOtpError(err.message.includes('non-2xx') ? 'Verification service error' : err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    setOtpError('');
    try {
      const { data, error } = await supabase.functions.invoke('verify-whatsapp-otp', {
        body: { phone: cleanPhone, otp: otpInput }
      });
      if (error || !data.success) throw new Error(error?.message || 'Invalid OTP');
      setIsOtpVerified(true);
      setOtpError('');
      setTimer(0);
    } catch (err) {
      setOtpError(err.message.includes('non-2xx') ? 'Invalid or expired OTP' : err.message);
    }
  };

  const uploadFile = async (file, bucket, path) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(`applications/${fileName}`, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(`applications/${fileName}`);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // Check form fields
    const fieldsToValidate = ['name', 'email', 'phone', 'dob', 'parents_name', 'parent_phone', 'address', 'school', 'passed_out_year'];
    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Check files
    Object.keys(files).forEach(key => { if (!files[key]) newErrors[key] = 'Required'; });

    if (!isOtpVerified) {
      newErrors.phone = 'Mobile number not verified';
      setOtpError('Verify your mobile number to continue');
    }

    if (!termsAccepted) {
      newErrors.terms = 'Declaration required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Determine specific message for the main error box
      let mainErrorMessage = 'Please fix the highlighted errors above';
      if (Object.keys(newErrors).length === 1 && !isOtpVerified) {
        mainErrorMessage = 'Please verify your mobile number with OTP to continue';
      } else if (Object.keys(newErrors).length === 1 && !termsAccepted) {
        mainErrorMessage = 'Please read and accept the terms and conditions';
      } else if (Object.keys(newErrors).length === 1) {
          const firstError = Object.values(newErrors)[0];
          const firstField = Object.keys(newErrors)[0].replace(/_/g, ' ');
          mainErrorMessage = `${firstField.toUpperCase()} is ${firstError.toLowerCase()}`;
      }
      
      setErrors(prev => ({ ...prev, submit: mainErrorMessage }));
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: emailCheck } = await supabase.from('applications').select('email').eq('email', formData.email.trim().toLowerCase()).maybeSingle();
      if (emailCheck) {
        setErrors(prev => ({ ...prev, email: 'This email is already in use' }));
        throw new Error('Please fix the duplicate email address');
      }

      const [cUrl, iUrl, bUrl] = await Promise.all([
        uploadFile(files.communityCertificate, 'data', 'community'),
        uploadFile(files.incomeCertificate, 'data', 'income'),
        uploadFile(files.bonofide, 'data', 'bonofide')
      ]);

      const { dob_day, dob_month, dob_year, ...dataToSubmit } = formData;

      const { error } = await supabase.from('applications').insert([{
        ...dataToSubmit,
        community_certificate_url: cUrl,
        income_certificate_url: iUrl,
        bonofide_url: bUrl
      }]);
      
      if (error) throw error;
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrors(prev => ({ ...prev, submit: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center shadow-2xl shadow-red-50">
          <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-100">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Registration Complete!</h1>
          <p className="text-slate-600 font-medium leading-relaxed mb-8">
            Your scholarship application has been successfully submitted. Our team will review your documents and contact you soon.
          </p>
          <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            REGISTER ANOTHER STUDENT
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <img src={logo} alt="OBC Logo" className="h-32 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">STUDENT REGISTRATION FORM</h1>
          <p className="text-red-600 font-bold mt-2 uppercase tracking-widest">OBC Students Scholarship Programme</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit}>
            <FormSection title="Student Identity" icon={User}>
              <InputField label="Full Name" name="name" placeholder="As per certificate" icon={User} required value={formData.name} onChange={handleInputChange} error={errors.name} />
              <InputField label="Email Address" name="email" type="email" placeholder="student@example.com" icon={Mail} required value={formData.email} onChange={handleInputChange} error={errors.email} />
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      name="phone" type="tel" placeholder="7639529193" required 
                      value={formData.phone} onChange={handleInputChange}
                      disabled={isOtpVerified}
                      className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3 pl-12 pr-5 text-slate-900 focus:outline-none focus:border-red-500 transition-all ${isOtpVerified ? 'bg-emerald-50 border-emerald-200' : ''}`}
                    />
                  </div>
                  {!isOtpVerified && (
                    <div className="flex flex-col gap-2">
                      <button 
                        type="button" onClick={handleSendOTP} 
                        disabled={isSendingOtp || (otpSent && timer > 0)}
                        className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Get OTP'}
                      </button>
                    </div>
                  )}
                </div>
                {errors.phone && <p className="text-xs text-red-600 ml-1 font-medium">{errors.phone}</p>}
                
                {otpSent && !isOtpVerified && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enter Verification Code</span>
                      {timer > 0 ? (
                        <span className="text-[10px] font-bold text-red-600">Expires in {formatTime(timer)}</span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-600">OTP Expired</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        placeholder="Enter 6-digit OTP" maxLength={6}
                        value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                        disabled={timer === 0}
                        className={`flex-1 bg-white border ${timer === 0 ? 'border-slate-100' : 'border-slate-200'} rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-red-500 outline-none transition-all ${timer === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <button 
                        type="button" onClick={handleVerifyOTP} 
                        disabled={timer === 0}
                        className="px-6 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700 transition-all disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                        Verify
                      </button>
                    </div>
                    {timer === 0 && <p className="text-[10px] text-red-500 font-bold mt-2 text-center uppercase tracking-tighter">Please resend a new OTP to continue</p>}
                  </div>
                )}
                {isOtpVerified && (
                  <p className="text-xs text-emerald-600 font-bold ml-1 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </p>
                )}
                {otpError && <p className="text-xs text-red-600 ml-1 mt-1 font-medium">{otpError}</p>}
              </div>

              <CustomDatePicker 
                label="Date of Birth" 
                value={formData.dob} 
                error={errors.dob} 
                onChange={(val) => setFormData(prev => ({ ...prev, dob: val }))} 
              />
            </FormSection>

            <FormSection title="Parent Details" icon={User}>
              <InputField label="Parent/Guardian Name" name="parents_name" placeholder="Full Name" icon={User} required value={formData.parents_name} onChange={handleInputChange} error={errors.parents_name} />
              <InputField label="Parent Mobile Number" name="parent_phone" placeholder="10-digit number" icon={Phone} required value={formData.parent_phone} onChange={handleInputChange} error={errors.parent_phone} />
              <div className="md:col-span-2">
                <InputField label="Permanent Address" name="address" placeholder="Full Residential Address" icon={MapPin} required value={formData.address} onChange={handleInputChange} error={errors.address} />
              </div>
            </FormSection>

            <FormSection title="Academic Details" icon={GraduationCap}>
              <div className="md:col-span-2">
                <InputField label="Institution Name (School/College)" name="school" placeholder="Full Institution Name" icon={GraduationCap} required value={formData.school} onChange={handleInputChange} error={errors.school} />
              </div>
              <SelectField 
                label="Year of Graduation" 
                name="passed_out_year" 
                icon={Calendar} 
                required 
                value={formData.passed_out_year} 
                onChange={handleInputChange} 
                error={errors.passed_out_year}
                options={Array.from({ length: 11 }, (_, i) => (2020 + i).toString())}
              />
            </FormSection>

            <FormSection title="Required Documents" icon={FileText}>
              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Community Certificate', field: 'communityCertificate' },
                    { label: 'Income Certificate', field: 'incomeCertificate' },
                    { label: 'Bonofide Certificate', field: 'bonofide' }
                  ].map((doc) => (
                    <div key={doc.field} className="relative group">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">{doc.label}</label>
                      <div className={`relative h-32 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer ${files[doc.field] ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:border-red-400 hover:bg-red-50'}`}>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, doc.field)} className="absolute inset-0 opacity-0 cursor-pointer" />
                        {files[doc.field] ? (
                          <>
                            <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
                            <span className="text-[10px] font-bold text-emerald-700 truncate w-full">{files[doc.field].name}</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-8 h-8 text-slate-300 mb-2 group-hover:text-red-500" />
                            <span className="text-[10px] font-bold text-slate-400">Click to upload</span>
                          </>
                        )}
                      </div>
                      {errors[doc.field] && <p className="text-[10px] text-red-600 font-bold mt-1.5 ml-1">{errors[doc.field]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>

            <div className="mt-12 space-y-6">
              <div className="h-60 overflow-y-auto p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-600 leading-relaxed custom-scrollbar shadow-inner">
                <div className="space-y-4">
                  <p className="font-bold text-slate-900">Society for the Rights of Backward and Most Backward Classes (SFRBC) and OBC Rights Invites Applications from Plus two (+2) Students for our OBC Students Scholarship Programme</p>
                  
                  <p>
                    <span className="font-bold">1. Our Organisation SFRBC / OBC Rights</span> provide scholarship for poor and meritorious students from BC and MBC Communities. Scholarship will be provided on the basis of marks and poverty to the students who want to join in engineering and arts college. The Scholarship is provided from our Organisation’s funds only.
                  </p>

                  <div>
                    <p className="font-bold mb-2">2. Eligibility:</p>
                    <ul className="space-y-2 pl-1">
                      <li className="flex gap-2"><span>a.</span> <span>The applicants ought to have secured more than 75% marks in Plus two 2026 exams</span></li>
                      <li className="flex gap-2"><span>b.</span> <span>They must be from BC or MBC (OBC) Communities</span></li>
                      <li className="flex gap-2"><span>c.</span> <span>The annual income of the parents or family must be below Rs. 4.2 lakhs per year or Rs. 35,000 per month</span></li>
                      <li className="flex gap-2"><span>d.</span> <span>Preference will be given to the students who do not have parents or living in poor conditions.</span></li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-bold mb-2">3. How to apply:</p>
                    <p className="mb-2">You should apply by filling the following columns in our website <a href="https://www.obcrights.org" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">www.obcrights.org</a> and submit:</p>
                    <ul className="space-y-1 pl-4 border-l-2 border-slate-200 mb-4">
                      <li>a. Full Name:</li>
                      <li>b. Full Address:</li>
                      <li>c. Email ID and Mobile Numbers:</li>
                      <li>d. Date of Birth:</li>
                    </ul>
                    <p className="mb-2 font-medium">Then you must scan and upload the following documents:</p>
                    <ul className="space-y-1 pl-4 border-l-2 border-slate-200 mb-4">
                      <li>a. Plus Two marksheet</li>
                      <li>b. BC / MBC Certificate</li>
                      <li>c. Income Affidavit</li>
                    </ul>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 italic text-slate-700 shadow-sm">
                      <p className="mb-3 font-bold not-italic text-slate-900">Fill the following income affidavit:</p>
                      <p className="mb-6">“We ………… (student name) and ……… (Father’s name) hereby solemnly affirm and sincerely state that our income per year is Rs. ………. (………… only in words)”.</p>
                      <div className="flex flex-col sm:flex-row justify-between gap-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                        <div className="flex flex-col items-center">
                          <div className="h-px w-24 bg-slate-300 mb-1"></div>
                          <span>Signature of the Parent</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-px w-24 bg-slate-300 mb-1"></div>
                          <span>Signature of the Student</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p>
                    <span className="font-bold">4.</span> Those who wish to send the aforesaid details by individual mail or by hard copies (in paper), may kindly send it to the following, mail id and address before 30.05.2026 evening.
                  </p>

                  <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-1">
                    <p><span className="font-bold text-slate-900">Mail ID:</span> <a href="mailto:jacofbc@gmail.com" className="text-red-600 hover:underline">jacofbc@gmail.com</a></p>
                    <p><span className="font-bold text-slate-900">Address:</span> Shri SS Globals, 42, West Club Road, Racecourse, Coimbatore – 641018.</p>
                  </div>

                  <p className="font-black text-red-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    For all your doubts, please contact the toll-free number: 1800 8900 403
                  </p>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      <span className="font-bold">Note:</span> Please note that the decision of the organisation is final and no one is entitled to make any claims.
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-4 cursor-pointer p-4 bg-white border border-slate-200 rounded-xl transition-all hover:bg-slate-50 group">
                <input 
                  type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} 
                  className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer" 
                />
                <span className="text-sm font-bold text-slate-700 select-none group-hover:text-slate-900">
                  I have read all the terms and conditions.
                </span>
              </label>
            </div>

            <div className="mt-10">
              {errors.submit && <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-bold rounded-xl text-center border border-red-100">{errors.submit}</div>}
              <button
                type="submit" disabled={isSubmitting}
                className="w-full py-5 bg-red-600 text-white text-xl font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) setError(loginError.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-100">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2">Secure Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <InputField label="Admin Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} placeholder="admin@example.com" required />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={ShieldCheck} placeholder="••••••••" required />
          
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

          <button disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'SIGN IN TO DASHBOARD'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const EditModal = ({ app, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...app });
  const [newFiles, setNewFiles] = useState({ 
    community: null, 
    income: null, 
    bonofide: null 
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'phone' || name === 'parent_phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      setErrors(prev => ({ ...prev, [field]: 'File exceeds 1MB' }));
      return;
    }
    setNewFiles(prev => ({ ...prev, [field]: file }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = async () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) newErrors.email = 'Required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.phone?.trim()) newErrors.phone = 'Required';
    else if (formData.phone.length !== 10) newErrors.phone = 'Must be 10 digits';

    if (!formData.dob) newErrors.dob = 'Required';
    if (!formData.parents_name?.trim()) newErrors.parents_name = 'Required';
    
    if (!formData.parent_phone?.trim()) newErrors.parent_phone = 'Required';
    else if (formData.parent_phone.length !== 10) newErrors.parent_phone = 'Must be 10 digits';

    if (!formData.school?.trim()) newErrors.school = 'Required';
    if (!formData.passed_out_year?.trim()) newErrors.passed_out_year = 'Required';
    if (!formData.address?.trim()) newErrors.address = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    // Duplication Check
    const { data, error } = await supabase
      .from('applications')
      .select('id, phone, email')
      .or(`phone.eq.${formData.phone},email.eq.${formData.email}`)
      .neq('id', app.id);
    
    if (data && data.length > 0) {
      data.forEach(item => {
        if (item.phone === formData.phone) newErrors.phone = 'Number already in use';
        if (item.email === formData.email) newErrors.email = 'Email already in use';
      });
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const uploadFile = async (file, bucket, path) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(`applications/${fileName}`, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(`applications/${fileName}`);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await validate()) {
      setIsSaving(true);
      try {
        let finalData = { ...formData };
        
        // Upload new certificates if selected
        if (newFiles.community) {
          finalData.community_certificate_url = await uploadFile(newFiles.community, 'data', 'community');
        }
        if (newFiles.income) {
          finalData.income_certificate_url = await uploadFile(newFiles.income, 'data', 'income');
        }
        if (newFiles.bonofide) {
          finalData.bonofide_url = await uploadFile(newFiles.bonofide, 'data', 'bonofide');
        }

        await onSave(app.id, finalData);
      } catch (err) {
        alert("Update failed: " + err.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Application</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ref ID: {app.id.slice(0, 8)}...</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-slate-400 hover:text-red-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Student Name" name="name" value={formData.name || ''} onChange={handleInputChange} icon={User} error={errors.name} />
              <InputField label="Email Address" name="email" value={formData.email || ''} onChange={handleInputChange} icon={Mail} error={errors.email} />
              <InputField label="Phone Number" name="phone" value={formData.phone || ''} onChange={handleInputChange} icon={Phone} error={errors.phone} />
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="date" name="dob" value={formData.dob || ''} onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-5 text-slate-900 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
                {errors.dob && <p className="text-xs text-red-600 font-bold ml-1">{errors.dob}</p>}
              </div>
              <InputField label="Parent Name" name="parents_name" value={formData.parents_name || ''} onChange={handleInputChange} icon={User} error={errors.parents_name} />
              <InputField label="Parent Phone" name="parent_phone" value={formData.parent_phone || ''} onChange={handleInputChange} icon={Phone} error={errors.parent_phone} />
              <div className="md:col-span-2">
                <InputField label="Institution" name="school" value={formData.school || ''} onChange={handleInputChange} icon={GraduationCap} error={errors.school} />
              </div>
              <SelectField 
                label="Graduation Year" 
                name="passed_out_year" 
                value={formData.passed_out_year || ''} 
                onChange={handleInputChange} 
                icon={Calendar} 
                error={errors.passed_out_year}
                options={Array.from({ length: 11 }, (_, i) => (2020 + i).toString())}
              />
              <div className="md:col-span-2">
                <InputField label="Permanent Address" name="address" value={formData.address || ''} onChange={handleInputChange} icon={MapPin} error={errors.address} />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Update Certificates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Community', field: 'community', url: formData.community_certificate_url },
                  { label: 'Income', field: 'income', url: formData.income_certificate_url },
                  { label: 'Bonofide', field: 'bonofide', url: formData.bonofide_url }
                ].map((doc) => (
                  <div key={doc.field} className="relative">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">{doc.label}</label>
                    <div className={`relative h-24 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-2 text-center cursor-pointer ${newFiles[doc.field] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-red-400'}`}>
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, doc.field)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {newFiles[doc.field] ? (
                        <span className="text-[10px] font-bold text-emerald-700 truncate w-full px-2">{newFiles[doc.field].name}</span>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <FileText className="w-4 h-4 text-slate-300" />
                          <span className="text-[9px] font-bold text-slate-400">Change File</span>
                        </div>
                      )}
                    </div>
                    {doc.url && (
                      <a href={doc.url} target="_blank" rel="noreferrer" className="mt-2 flex items-center justify-center gap-1 text-[9px] font-bold text-red-600 hover:underline">
                        <ExternalLink className="w-3 h-3" /> View Current
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">
          <button onClick={onClose} type="button" className="px-8 py-3 text-sm font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Cancel</button>
          <button 
            type="submit" form="edit-form" disabled={isSaving} 
            className="px-10 py-3 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 uppercase tracking-widest disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Application'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingApp, setEditingApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (!error) setApplications(data);
    setLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) {
        alert("Error deleting: " + error.message);
      } else {
        fetchApplications();
      }
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      // Explicitly map only the columns that exist in the database
      // to avoid sending any unexpected state fields
      const cleanData = {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        dob: updatedData.dob,
        parents_name: updatedData.parents_name,
        parent_phone: updatedData.parent_phone,
        address: updatedData.address,
        school: updatedData.school,
        passed_out_year: updatedData.passed_out_year,
        community_certificate_url: updatedData.community_certificate_url,
        income_certificate_url: updatedData.income_certificate_url,
        bonofide_url: updatedData.bonofide_url
      };
      
      console.log('Attempting explicit update for ID:', id, cleanData);

      const { data, error, status, statusText } = await supabase
        .from('applications')
        .update(cleanData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase Error:', error);
        throw error;
      }

      // If data is returned, the update was successful
      if (data && data.length > 0) {
        setEditingApp(null);
        await fetchApplications();
        alert('Record updated successfully!');
      } else {
        // If no data but no error, it means no rows matched the ID
        console.warn('No rows updated. Status:', status, statusText);
        alert(`Update failed: No record found with ID ${id}. This usually happens if Row Level Security (RLS) policies are blocking the update.`);
      }
    } catch (err) {
      console.error('Update Exception:', err);
      alert('Update failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleExport = () => {
    if (applications.length === 0) {
      alert("No data to export");
      return;
    }
    
    // Define headers
    const headers = ["Student Name", "Email Address", "Phone Number", "Date of Birth", "Parent Name", "Parent Phone", "Institution", "Graduation Year", "Address", "Community Cert URL", "Income Cert URL", "Bonofide Cert URL", "Applied At"];
    
    // Map data to rows
    const rows = applications.map(app => [
      `"${(app.name || '').replace(/"/g, '""')}"`,
      `"${(app.email || '').replace(/"/g, '""')}"`,
      `'${app.phone || ''}`, // Add apostrophe to prevent Excel from scientific notation
      `'${app.dob || ''}`,   // Add apostrophe to prevent Excel from showing #######
      `"${(app.parents_name || '').replace(/"/g, '""')}"`,
      `'${app.parent_phone || ''}`,
      `"${(app.school || '').replace(/"/g, '""')}"`,
      `"${app.passed_out_year || ''}"`,
      `"${(app.address || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${app.community_certificate_url || ''}"`,
      `"${app.income_certificate_url || ''}"`,
      `"${app.bonofide_url || ''}"`,
      `"${app.created_at || ''}"`
    ]);

    // Create CSV content
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `obc_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = applications.filter(app => 
    (app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (app.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.phone || '').includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-red-600 p-2 rounded-lg"><ShieldCheck className="w-5 h-5 text-white" /></div>
          <span className="font-black text-slate-900 tracking-tight whitespace-nowrap">OBC ADMIN DASHBOARD</span>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 w-full sm:w-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total: {applications.length}</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 md:px-4 py-2 rounded-xl font-black text-[10px] md:text-xs transition-all uppercase tracking-widest border border-emerald-100"
            >
              <Download className="w-4 h-4" /> <span className="hidden xs:inline">Export</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-900 hover:text-red-600 font-black text-sm transition-colors border-l border-slate-200 pl-4">
              <LogOut className="w-4 h-4" /> <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4 md:p-8">
        <div className="mb-8 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Scholarship Applications</h1>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" placeholder="Search students..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-xl">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto mb-4" />
            <p className="font-bold text-slate-400">Loading Data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-xl text-slate-400 font-bold">
            No Records Found
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1600px]">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Student Name</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Email Address</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Phone No</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">DOB</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Parent Name</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Parent Phone</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Institution</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Year of Graduation</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Address</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Docs</th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-black text-slate-900 border-r border-slate-100 whitespace-nowrap">{app.name}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-600 border-r border-slate-100">{app.email}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-600 border-r border-slate-100">{app.phone}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-600 border-r border-slate-100 whitespace-nowrap">{app.dob ? new Date(app.dob).toLocaleDateString('en-GB') : '—'}</td>
                        <td className="px-4 py-4 text-xs font-black text-slate-900 border-r border-slate-100 whitespace-nowrap">{app.parents_name || '—'}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-600 border-r border-slate-100">{app.parent_phone || '—'}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-600 border-r border-slate-100 whitespace-nowrap max-w-[250px] truncate">{app.school || '—'}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-600 border-r border-slate-100">{app.passed_out_year || '—'}</td>
                        <td className="px-4 py-4 text-[10px] font-medium text-slate-500 border-r border-slate-100 max-w-[300px] truncate" title={app.address}>{app.address || '—'}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <MiniDocLink href={app.community_certificate_url} label="C" />
                            <MiniDocLink href={app.income_certificate_url} label="I" />
                            <MiniDocLink href={app.bonofide_url} label="B" />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => setEditingApp(app)} className="p-2 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 rounded-lg transition-all border border-slate-200"><Edit className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete(app.id)} className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-all border border-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((app) => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="max-w-[70%]">
                      <h3 className="font-black text-slate-900 leading-tight truncate">{app.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate">{app.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingApp(app)} className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200"><Edit className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete(app.id)} className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-50 pt-4 flex-grow">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Phone</span>
                      <span className="text-[11px] font-bold text-slate-700">{app.phone}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">DOB</span>
                      <span className="text-[11px] font-bold text-slate-700">{app.dob ? new Date(app.dob).toLocaleDateString('en-GB') : '—'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Parent Name</span>
                      <span className="text-[11px] font-black text-slate-900 truncate block">{app.parents_name || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Parent Phone</span>
                      <span className="text-[11px] font-bold text-slate-700">{app.parent_phone || '—'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Institution</span>
                      <span className="text-[11px] font-bold text-slate-700 truncate block">{app.school || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Grad Year</span>
                      <span className="text-[11px] font-bold text-slate-700">{app.passed_out_year || '—'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Address</span>
                      <span className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed">{app.address || '—'}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between bg-slate-50 -mx-5 -mb-5 p-3 px-5 border-t border-slate-100">
                    <div className="flex gap-2">
                      <MiniDocLink href={app.community_certificate_url} label="C" />
                      <MiniDocLink href={app.income_certificate_url} label="I" />
                      <MiniDocLink href={app.bonofide_url} label="B" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400">REF: {app.id.slice(0, 8)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {editingApp && (
        <EditModal 
          app={editingApp} 
          onClose={() => setEditingApp(null)} 
          onSave={handleUpdate} 
        />
      )}
    </div>
  );
};

const MiniDocLink = ({ href, label }) => (
  <a 
    href={href} target="_blank" rel="noreferrer" 
    className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 rounded-lg text-[10px] font-black transition-all border border-slate-200"
    title={`View ${label} Certificate`}
  >
    {label}
  </a>
);

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicForm />} />
        <Route path="/admin" element={session ? <AdminDashboard /> : <AdminLogin />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

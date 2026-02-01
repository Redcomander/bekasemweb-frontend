import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pendaftaranSchema } from '../../../schemas/pendaftaranSchema';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { UserIcon, HeartIcon, UsersIcon, CalendarDaysIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import StepSuami from './StepSuami';
import StepIstri from './StepIstri';
import StepWali from './StepWali';
import StepRencana from './StepRencana';
import StepReview from './StepReview';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const steps = [
    { title: 'Data Suami', icon: UserIcon },
    { title: 'Data Istri', icon: HeartIcon },
    { title: 'Data Wali', icon: UsersIcon },
    { title: 'Rencana', icon: CalendarDaysIcon },
    { title: 'Review', icon: DocumentCheckIcon },
];

export default function PendaftaranWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const navigate = useNavigate();

    const methods = useForm({
        resolver: zodResolver(pendaftaranSchema),
        mode: 'onChange',
        defaultValues: {
            status_pria: 'jejaka',
            status_wanita: 'perawan',
            lokasi_nikah: 'KUA'
        }
    });

    const nextStep = async () => {
        // Validation logic per step triggers here
        let fieldsToValidate = [];
        if (currentStep === 0) fieldsToValidate = ['nik_pria', 'nama_pria', 'tempat_lahir_pria', 'tanggal_lahir_pria', 'alamat_pria', 'no_hp_pria'];
        if (currentStep === 1) fieldsToValidate = ['nik_wanita', 'nama_wanita', 'tempat_lahir_wanita', 'tanggal_lahir_wanita', 'alamat_wanita', 'no_hp_wanita'];
        if (currentStep === 2) fieldsToValidate = ['nama_wali', 'hubungan_wali'];
        if (currentStep === 3) fieldsToValidate = ['tanggal_nikah', 'jam_nikah', 'lokasi_nikah'];

        const isValid = await methods.trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);

        // Sanitize data
        const payload = { ...data };
        // Ensure mahar is null if empty string, or numeric
        if (payload.mahar === '' || payload.mahar === undefined) {
            payload.mahar = null;
        }

        try {
            const response = await api.post('/pendaftaran-nikah', payload);
            console.log('Success:', response.data);
            navigate('/pendaftaran-sukses', { state: { result: response.data } });
        } catch (error) {
            console.error('Submission failed:', error);

            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                let errorMessages = [];

                // Map server errors to form fields
                Object.keys(errors).forEach(key => {
                    methods.setError(key, { type: 'server', message: errors[key][0] });
                    // Simplify key for display (e.g. 'nik_pria' -> 'NIK Calon Suami')
                    errorMessages.push(errors[key][0]);
                });

                // Show first error or generic message
                setSubmitError(`Gagal Validasi: ${errorMessages[0] || 'Periksa kembali data inputan Anda.'}`);
            } else {
                setSubmitError(error.response?.data?.message || 'Terjadi kesalahan saat mengirim data.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section - Dark for Header Visibility */}
            <div className="bg-kemenag-green relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-white mb-2">Formulir Pendaftaran Nikah</h1>
                    <p className="text-white/80">Isi data dengan lengkap dan benar sesuai dokumen kependudukan.</p>
                </div>
                {/* Decorative Bottom Wave - Optional or just simple curve */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-50 rounded-t-3xl transform translate-y-2"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-20">

                {/* Steps Indicator */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[500px] px-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${idx < currentStep ? 'bg-kemenag-green text-white' :
                                    idx === currentStep ? 'bg-kemenag-gold text-white shadow-lg ring-4 ring-kemenag-gold/20' :
                                        'bg-white text-gray-400 border-2 border-gray-200'
                                    }`}>
                                    {idx < currentStep ? <CheckCircleIcon className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${idx <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                        {/* Progress Bar Background */}
                        <div className="absolute top-[4.5rem] left-0 w-full h-1 bg-gray-200 -z-0 hidden md:block"></div>
                        {/* Active Progress Bar - need complex logic for width or just ignore for simplicity */}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 animate-fade-in-up">
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>

                            {submitError && (
                                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                                    <span className="font-bold">Error:</span> {submitError}
                                </div>
                            )}

                            {currentStep === 0 && <StepSuami />}
                            {currentStep === 1 && <StepIstri />}
                            {currentStep === 2 && <StepWali />}
                            {currentStep === 3 && <StepRencana />}
                            {currentStep === 4 && <StepReview data={methods.getValues()} />}

                            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between pt-6 border-t border-gray-100 gap-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 0 || isSubmitting}
                                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-colors w-full sm:w-auto ${currentStep === 0 ? 'hidden sm:invisible' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Kembali
                                </button>

                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn-primary px-8 py-3 w-full sm:w-auto text-center"
                                    >
                                        Lanjut
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-gold px-8 py-3 w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}

import { useFormContext, useWatch } from 'react-hook-form';

export default function StepRencana() {
    const { register, formState: { errors }, control } = useFormContext();
    const lokasiNikah = useWatch({ control, name: 'lokasi_nikah' });

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-6">Rencana Pernikahan</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Tanggal Nikah */}
                <div>
                    <label className="form-label">Tanggal Akad Nikah <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        {...register('tanggal_nikah')}
                        className={`form-input-premium ${errors.tanggal_nikah ? '!border-red-500' : ''}`}
                    />
                    {errors.tanggal_nikah && <p className="mt-1 text-sm text-red-500">{errors.tanggal_nikah.message}</p>}
                    <p className="text-xs text-gray-500 mt-1">Minimal 10 hari kerja dari hari ini</p>
                </div>

                {/* Jam Nikah */}
                <div>
                    <label className="form-label">Jam Akad Nikah <span className="text-red-500">*</span></label>
                    <input
                        type="time"
                        {...register('jam_nikah')}
                        className={`form-input-premium ${errors.jam_nikah ? '!border-red-500' : ''}`}
                    />
                    {errors.jam_nikah && <p className="mt-1 text-sm text-red-500">{errors.jam_nikah.message}</p>}
                </div>

                {/* Lokasi Nikah Selection */}
                <div className="md:col-span-2">
                    <label className="form-label mb-2">Lokasi Akad Nikah <span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                        <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${lokasiNikah === 'KUA' ? 'border-kemenag-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                                type="radio"
                                value="KUA"
                                {...register('lokasi_nikah')}
                                className="sr-only"
                            />
                            <div className="flex flex-col items-center text-center">
                                <span className="font-bold text-gray-900">Di Kantor KUA</span>
                                <span className="text-xs text-gray-500 mt-1">Gratis (Biaya Rp 0,-)</span>
                            </div>
                        </label>
                        <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${lokasiNikah === 'Luar KUA' ? 'border-kemenag-green bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                                type="radio"
                                value="Luar KUA"
                                {...register('lokasi_nikah')}
                                className="sr-only"
                            />
                            <div className="flex flex-col items-center text-center">
                                <span className="font-bold text-gray-900">Di Luar KUA</span>
                                <span className="text-xs text-gray-500 mt-1">Biaya PNBP Rp 600.000,-</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Alamat Nikah (If Luar KUA) */}
                {lokasiNikah === 'Luar KUA' && (
                    <div className="md:col-span-2 animate-fade-in-up">
                        <label className="form-label">Alamat Lengkap Lokasi Akad <span className="text-red-500">*</span></label>
                        <textarea
                            rows={3}
                            {...register('alamat_nikah')}
                            className={`form-input-premium ${errors.alamat_nikah ? '!border-red-500' : ''}`}
                            placeholder="Nama Gedung/Masjid/Rumah, Jalan, dll"
                        ></textarea>
                        {errors.alamat_nikah && <p className="mt-1 text-sm text-red-500">{errors.alamat_nikah.message}</p>}
                    </div>
                )}

                {/* Mahar Fields Swapped */}
                <div>
                    <label className="form-label">Bentuk / Jenis Mahar</label>
                    <input
                        type="text"
                        {...register('mahar_keterangan')}
                        className="form-input-premium"
                        placeholder="Contoh: Emas 10 Gram, Seperangkat Alat Sholat"
                    />
                </div>
                <div>
                    <label className="form-label">Nilai Rupiah (Opsional)</label>
                    <input
                        type="number"
                        {...register('mahar')}
                        className="form-input-premium"
                        placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Isi jika mahar berupa uang tunai</p>
                </div>
            </div>
        </div>
    );
}

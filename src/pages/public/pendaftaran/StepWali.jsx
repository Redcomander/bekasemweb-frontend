import { useFormContext } from 'react-hook-form';

export default function StepWali() {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-6">Data Wali Nikah</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* Nama Wali */}
                <div className="md:col-span-2">
                    <label className="form-label">Nama Lengkap Wali <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        {...register('nama_wali')}
                        className={`form-input-premium ${errors.nama_wali ? '!border-red-500' : ''}`}
                        placeholder="Sesuai KTP"
                    />
                    {errors.nama_wali && <p className="mt-1 text-sm text-red-500">{errors.nama_wali.message}</p>}
                </div>

                {/* Hubungan */}
                <div className="md:col-span-2">
                    <label className="form-label">Hubungan dengan Calon Istri <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        {...register('hubungan_wali')}
                        className={`form-input-premium ${errors.hubungan_wali ? '!border-red-500' : ''}`}
                        placeholder="Contoh: Ayah Kandung, Kakak Kandung, Paman, dll"
                    />
                    {errors.hubungan_wali && <p className="mt-1 text-sm text-red-500">{errors.hubungan_wali.message}</p>}
                </div>

                {/* No HP */}
                <div className="md:col-span-2">
                    <label className="form-label">Nomor HP/WA Wali</label>
                    <input 
                        type="tel" 
                        {...register('no_hp_wali')}
                        className={`form-input-premium ${errors.no_hp_wali ? '!border-red-500' : ''}`}
                        placeholder="08xxxxxxxxxx"
                    />
                     {errors.no_hp_wali && <p className="mt-1 text-sm text-red-500">{errors.no_hp_wali.message}</p>}
                </div>
            </div>
        </div>
    );
}

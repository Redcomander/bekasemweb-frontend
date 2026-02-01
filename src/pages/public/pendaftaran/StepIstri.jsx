import { useFormContext } from 'react-hook-form';

export default function StepIstri() {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-6">Data Calon Istri</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* NIK */}
                <div className="md:col-span-2">
                    <label className="form-label">NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        maxLength={16}
                        {...register('nik_wanita')}
                        className={`form-input-premium ${errors.nik_wanita ? '!border-red-500' : ''}`}
                        placeholder="16 digit angka"
                    />
                    {errors.nik_wanita && <p className="mt-1 text-sm text-red-500">{errors.nik_wanita.message}</p>}
                </div>

                {/* Nama Lengkap */}
                <div className="md:col-span-2">
                    <label className="form-label">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        {...register('nama_wanita')}
                        className={`form-input-premium ${errors.nama_wanita ? '!border-red-500' : ''}`}
                        placeholder="Sesuai KTP"
                    />
                    {errors.nama_wanita && <p className="mt-1 text-sm text-red-500">{errors.nama_wanita.message}</p>}
                </div>

                {/* Tempat Lahir */}
                <div>
                    <label className="form-label">Tempat Lahir <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        {...register('tempat_lahir_wanita')}
                        className={`form-input-premium ${errors.tempat_lahir_wanita ? '!border-red-500' : ''}`}
                    />
                    {errors.tempat_lahir_wanita && <p className="mt-1 text-sm text-red-500">{errors.tempat_lahir_wanita.message}</p>}
                </div>

                {/* Tanggal Lahir */}
                <div>
                    <label className="form-label">Tanggal Lahir <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        {...register('tanggal_lahir_wanita')}
                        className={`form-input-premium ${errors.tanggal_lahir_wanita ? '!border-red-500' : ''}`}
                    />
                    {errors.tanggal_lahir_wanita && <p className="mt-1 text-sm text-red-500">{errors.tanggal_lahir_wanita.message}</p>}
                    <p className="text-xs text-gray-500 mt-1">Usia minimal 19 tahun</p>
                </div>

                {/* Status */}
                <div>
                    <label className="form-label">Status Pernikahan <span className="text-red-500">*</span></label>
                    <select
                        {...register('status_wanita')}
                        className="form-input-premium"
                    >
                        <option value="perawan">Perawan</option>
                        <option value="janda">Janda</option>
                    </select>
                </div>

                {/* No HP */}
                <div>
                    <label className="form-label">Nomor HP/WA <span className="text-red-500">*</span></label>
                    <input
                        type="tel"
                        {...register('no_hp_wanita')}
                        className={`form-input-premium ${errors.no_hp_wanita ? '!border-red-500' : ''}`}
                        placeholder="08xxxxxxxxxx"
                    />
                    {errors.no_hp_wanita && <p className="mt-1 text-sm text-red-500">{errors.no_hp_wanita.message}</p>}
                </div>

                {/* Pekerjaan */}
                <div className="md:col-span-2">
                    <label className="form-label">Pekerjaan</label>
                    <input
                        type="text"
                        {...register('pekerjaan_wanita')}
                        className="form-input-premium"
                    />
                </div>

                {/* Alamat */}
                <div className="md:col-span-2">
                    <label className="form-label">Alamat Lengkap <span className="text-red-500">*</span></label>
                    <textarea
                        rows={3}
                        {...register('alamat_wanita')}
                        className={`form-input-premium ${errors.alamat_wanita ? '!border-red-500' : ''}`}
                        placeholder="Jalan, RT/RW, Dusun, Desa/Kelurahan, Kecamatan"
                    ></textarea>
                    {errors.alamat_wanita && <p className="mt-1 text-sm text-red-500">{errors.alamat_wanita.message}</p>}
                </div>
            </div>
        </div>
    );
}

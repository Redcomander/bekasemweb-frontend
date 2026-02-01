export default function StepReview({ data }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-6">Review Data Pendaftaran</h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                    Mohon periksa kembali data yang Anda masukkan. Pastikan semua data sudah benar dan sesuai dengan dokumen kependudukan (KTP/KK) sebelum mengirim pendaftaran.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Suami */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-1">Data Calon Suami</h3>
                    <ReviewItem label="NIK" value={data.nik_pria} />
                    <ReviewItem label="Nama Lengkap" value={data.nama_pria} />
                    <ReviewItem label="TTL" value={`${data.tempat_lahir_pria}, ${data.tanggal_lahir_pria}`} />
                    <ReviewItem label="Status" value={data.status_pria} />
                    <ReviewItem label="Alamat" value={data.alamat_pria} />
                    <ReviewItem label="No HP" value={data.no_hp_pria} />
                </div>

                {/* Istri */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-1">Data Calon Istri</h3>
                    <ReviewItem label="NIK" value={data.nik_wanita} />
                    <ReviewItem label="Nama Lengkap" value={data.nama_wanita} />
                    <ReviewItem label="TTL" value={`${data.tempat_lahir_wanita}, ${data.tanggal_lahir_wanita}`} />
                    <ReviewItem label="Status" value={data.status_wanita} />
                    <ReviewItem label="Alamat" value={data.alamat_wanita} />
                    <ReviewItem label="No HP" value={data.no_hp_wanita} />
                </div>

                {/* Wali */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-1">Data Wali</h3>
                    <ReviewItem label="Nama Wali" value={data.nama_wali} />
                    <ReviewItem label="Hubungan" value={data.hubungan_wali} />
                    <ReviewItem label="No HP" value={data.no_hp_wali || '-'} />
                </div>

                {/* Rencana */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 border-b pb-1">Rencana Pernikahan</h3>
                    <ReviewItem label="Tanggal" value={data.tanggal_nikah} />
                    <ReviewItem label="Jam" value={data.jam_nikah} />
                    <ReviewItem label="Lokasi" value={data.lokasi_nikah} />
                    {data.lokasi_nikah === 'Luar KUA' && <ReviewItem label="Alamat Lokasi" value={data.alamat_nikah} />}
                    <ReviewItem label="Mahar" value={`${data.mahar || '-'} (${data.mahar_keterangan || '-'})`} />
                </div>
            </div>
        </div>
    );
}

function ReviewItem({ label, value }) {
    return (
        <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="col-span-2 font-medium text-gray-900 capitalize">{value}</span>
        </div>
    );
}

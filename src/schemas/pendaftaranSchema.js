import { z } from 'zod';

export const pendaftaranSchema = z.object({
    // Step 1: Calon Suami
    nik_pria: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK harus berupa angka"),
    nama_pria: z.string().min(3, "Nama terlalu pendek"),
    tempat_lahir_pria: z.string().min(3, "Tempat lahir wajib diisi"),
    tanggal_lahir_pria: z.string().min(1, "Tanggal lahir wajib diisi"),
    alamat_pria: z.string().min(10, "Alamat terlalu pendek, mohon lengkapi"),
    no_hp_pria: z.string().min(10, "Nomor HP tidak valid").regex(/^\d+$/, "Nomor HP harus berupa angka"),
    pekerjaan_pria: z.string().optional(),
    status_pria: z.enum(['jejaka', 'duda']),

    // Step 2: Calon Istri
    nik_wanita: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK harus berupa angka"),
    nama_wanita: z.string().min(3, "Nama terlalu pendek"),
    tempat_lahir_wanita: z.string().min(3, "Tempat lahir wajib diisi"),
    tanggal_lahir_wanita: z.string().min(1, "Tanggal lahir wajib diisi"),
    alamat_wanita: z.string().min(10, "Alamat terlalu pendek, mohon lengkapi"),
    no_hp_wanita: z.string().min(10, "Nomor HP tidak valid").regex(/^\d+$/, "Nomor HP harus berupa angka"),
    pekerjaan_wanita: z.string().optional(),
    status_wanita: z.enum(['perawan', 'janda']),

    // Step 3: Wali
    nama_wali: z.string().min(3, "Nama wali terlalu pendek"),
    hubungan_wali: z.string().min(3, "Hubungan wali wajib diisi"),
    no_hp_wali: z.string().optional(),

    // Step 4: Rencana
    tanggal_nikah: z.string().min(1, "Tanggal nikah wajib diisi"),
    jam_nikah: z.string().min(1, "Jam nikah wajib diisi"),
    lokasi_nikah: z.string().min(3, "Lokasi nikah wajib diisi"),
    alamat_nikah: z.string().optional(),
    mahar: z.string().optional(),
    mahar_keterangan: z.string().optional(),
});

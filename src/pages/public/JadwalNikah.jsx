import { useState } from 'react';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function JadwalNikah() {
    const [selectedDate, setSelectedDate] = useState('');

    // Dummy data for example
    const schedules = [
        { id: 1, date: '2026-01-15', time: '08:00', groom: 'Ahmad Fulan', bride: 'Siti Fulanah', location: 'KUA Sembawa', status: 'Terjadwal' },
        { id: 2, date: '2026-01-15', time: '10:00', groom: 'Budi Santoso', bride: 'Rina Wati', location: 'Masjid Al-Ikhlas', status: 'Terjadwal' },
        { id: 3, date: '2026-01-16', time: '09:00', groom: 'Dedi Kurniawan', bride: 'Maya Sari', location: 'Rumah Mempelai Wanita', status: 'Terjadwal' },
    ];

    return (
        <div>
            {/* Header */}
            <section className="bg-purple-900 py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
                    <h1 className="text-4xl font-bold mb-4">Jadwal Nikah</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        Informasi jadwal akad nikah yang terdaftar di KUA Kecamatan Sembawa.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Check Availability Box */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12 -mt-24 relative z-20">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CalendarDaysIcon className="w-6 h-6 text-kemenag-green" />
                            Cek Ketersediaan Jadwal
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tanggal</label>
                                <input
                                    type="date"
                                    className="w-full rounded-lg border-gray-300 focus:border-kemenag-green focus:ring-kemenag-green"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                            <button className="w-full md:w-auto btn-primary px-8">
                                Cek Jadwal
                            </button>
                        </div>
                    </div>

                    {/* Schedule List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Jadwal Akad Nikah Terkini</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {schedules.map((item) => (
                                <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2 text-kemenag-green font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                                            <CalendarDaysIcon className="w-4 h-4" />
                                            {item.date}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.status}</span>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3">
                                            <ClockIcon className="w-5 h-5 text-gray-400" />
                                            <span className="font-semibold text-gray-900">{item.time} WIB</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <span className="text-gray-600 text-sm">{item.location}</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-medium text-gray-900">{item.groom}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                            <span className="text-sm font-medium text-gray-900">{item.bride}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

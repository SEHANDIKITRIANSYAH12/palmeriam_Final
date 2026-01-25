export type ComplaintStatus = 'Diterima' | 'Sedang Ditinjau' | 'Dalam Pengerjaan' | 'Selesai' | 'Ditolak';

export interface StatusHistory {
  status: ComplaintStatus;
  timestamp: string;
  notes: string;
}

export interface Complaint {
  ticketId: string;
  name: string;
  phone: string;
  email?: string;
  category: string;
  subject: string;
  message: string;
  submittedDate: string;
  status: ComplaintStatus;
  history: StatusHistory[];
}

// Data tiruan untuk simulasi database
export const complaintsData: Complaint[] = [
  {
    ticketId: 'SIPALMI-20240720-ABCD',
    name: 'Budi Santoso',
    phone: '081234567890',
    category: 'infrastruktur',
    subject: 'Lampu Jalan Mati di Depan Gang Melati',
    message: 'Selamat pagi, saya ingin melaporkan bahwa lampu penerangan jalan umum (PJU) di depan Gang Melati, RT 03/RW 05 sudah mati selama 3 hari terakhir. Mohon untuk segera diperbaiki karena kondisi jalan menjadi sangat gelap dan rawan.',
    submittedDate: '2024-07-20T10:30:00Z',
    status: 'Selesai',
    history: [
      {
        status: 'Diterima',
        timestamp: '2024-07-20T10:30:00Z',
        notes: 'Pengaduan telah diterima oleh sistem dan akan diteruskan ke petugas terkait.',
      },
      {
        status: 'Sedang Ditinjau',
        timestamp: '2024-07-20T11:00:00Z',
        notes: 'Pengaduan sedang ditinjau oleh seksi Kesejahteraan Rakyat.',
      },
      {
        status: 'Dalam Pengerjaan',
        timestamp: '2024-07-21T09:00:00Z',
        notes: 'Petugas teknis telah dikirim ke lokasi untuk melakukan perbaikan.',
      },
      {
        status: 'Selesai',
        timestamp: '2024-07-21T14:00:00Z',
        notes: 'Lampu jalan telah berhasil diperbaiki dan berfungsi normal. Pengaduan ditutup.',
      },
    ],
  },
];

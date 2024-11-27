# React Bang.AI

React Bang.AI adalah platform yang terinspirasi dari ChatGPT OpenAI, dengan UI yang cukup mirip dengan ChatGPT OpenAI. Platform ini dirancang untuk memberikan pengalaman interaktif dalam berkomunikasi dengan AI. Tentunya, proyek ini masih memerlukan banyak improvement agar lebih canggih dan fungsional.

## Key Features

- **Real-time Chat**: Komunikasi dengan AI secara real-time dengan tampilan yang responsif.
- **Streaming Responses**: Mendukung streaming responses dari AI, memberikan pengalaman yang lebih alami dan cepat.
- **Local Storage**: Riwayat chat disimpan di local storage, sehingga pengguna dapat melanjutkan percakapan sebelumnya.
- **Markdown Support**: Mendukung format markdown dalam pesan, termasuk syntax highlighting untuk kode.
- **Copy to Clipboard**: Fitur untuk menyalin kode langsung dari chat ke clipboard.
- **Dynamic Textarea**: Textarea yang dapat menyesuaikan ukuran secara otomatis berdasarkan jumlah baris teks.

## Libraries Used

- **[React](https://reactjs.org/)**: Digunakan sebagai library utama untuk membangun antarmuka pengguna yang dinamis.
- **[React Markdown](https://github.com/remarkjs/react-markdown)**: Memungkinkan rendering konten markdown dalam komponen React.
- **[Remark GFM](https://github.com/remarkjs/remark-gfm)**: Plugin untuk mendukung sintaks GitHub Flavored Markdown.
- **[React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)**: Digunakan untuk menambahkan syntax highlighting pada blok kode dalam pesan.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS yang digunakan untuk styling komponen dengan cepat dan konsisten.

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd react-bang-ai
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Duplikat file `.env.example`, lalu rename menjadi `.env` dan isi variabel dengan value yang sesuai.

## Running Locally

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Open your browser**:
   - Buka `http://localhost:5173` untuk melihat aplikasi berjalan.

Untuk melihat lebih dalam tentang fitur-fitur ini, kamu bisa langsung mengeksplorasi kodingan di dalam project ini.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# 🌸 Cici's Brasserie 🥞✨

Selamat datang di **Cici's Brasserie**, sebuah game simulasi manajemen kafe (tycoon/cooking) bergaya pixel art retro yang dibangun menggunakan teknologi web modern. Kelola kafemu, masak makanan lezat, layani pelanggan yang lapar, dan tingkatkan kafe impianmu!

---

## 🎮 Cara Bermain
1. **Pergerakan**: Gunakan tombol **W, A, S, D** di keyboard untuk menggerakkan Amelia (barista kafe).
2. **Menerima Pesanan**: Klik balon pesanan di atas kepala pelanggan yang baru datang (`ORDERING`). Amelia hanya bisa memproses **satu pesanan secara bergantian** untuk menjaga kualitas layanan!
3. **Memasak**: Berjalanlah ke area dapur (kiri atas) dan klik tombol **🍳 MASAK 🍳** yang muncul. Proses memasak membutuhkan waktu beberapa detik.
4. **Mengambil & Menyajikan Makanan**: Berjalanlah mendekati meja konter untuk mengambil makanan yang sudah matang, lalu antarkan ke pelanggan yang memesannya (`WAITING`).
5. **Mengumpulkan Koin**: Pelanggan yang selesai makan (`EATING`) akan pergi dan meninggalkan koin di meja. Berjalanlah mendekati koin tersebut untuk menariknya secara otomatis (**Magnetik**).
6. **Upgrade Kafe**: Klik menu **🛒 SHOP** di navbar atas untuk membuka menu baru seperti *Burger*, *Croissant*, dan *Strawberry Cake* menggunakan koin yang kamu kumpulkan!

---

## 🛠️ Teknologi yang Digunakan
* **Phaser 3**: Framework game HTML5/JavaScript untuk rendering grafis 2D berkinerja tinggi, sistem fisika (*arcade physics*), animasi sprite, dan manajemen state game.
* **JavaScript (ES6+)**: Bahasa pemrograman utama untuk logika permainan, kecerdasan buatan (AI) pelanggan, sistem leveling, dan algoritma *magnetic coin*.
* **HTML5 & Vanilla CSS3**: Untuk struktur kontainer game (`#game-container`) dan styling tampilan agar pas di semua ukuran layar browser.

---

## ✨ Fitur Utama & Kelebihan
* **Desain Visual Pixel Art Premium**: Dilengkapi dengan sistem penskalaan dinamis (*Anti-Gepeng Scaling Logic*), memastikan visual game terlihat proporsional, tajam, dan indah di berbagai perangkat (desktop maupun mobile).
* **Efek Suara Imut & Pengaturan Musik**:
  - Dilengkapi soundtrack musik retro chiptune yang ceria.
  - Memiliki **Menu Pengaturan Suara (Settings)** terintegrasi di halaman utama (Intro) dan menu jeda (Pause) untuk menyalakan/mematikan musik (`ON/OFF`) serta mengatur volume suara secara real-time (`[-]` dan `[+]`).
* **Sistem Koin Magnetik**: Efek visual dinamis di mana koin akan otomatis meluncur terbang ke arah navbar dompet pemain ketika Amelia berada di dekatnya, lengkap dengan efek suara chiptune cringg yang memuaskan.
* **Sistem Level & Toko Upgrade**: Pemain bisa meningkatkan level barista untuk menambah kecepatan jalan, serta membelanjakan koin untuk melakukan *unlock* resep baru di toko upgrade dengan syarat level tertentu.
* **Logika Antrean yang Realistis**: Barista Amelia hanya bisa melayani satu pesanan aktif dalam satu waktu agar siklus gameplay lebih teratur dan menantang bagi pemain.
* **Invisible Physics Boundaries**: Semua dinding pembatas gerakan (*collision boundaries*) disembunyikan sepenuhnya agar estetika permainan terlihat rapi tanpa merusak mekanika tabrakan.

---

## 🧠 Logika & Alur Program (*Game Flow*)
```mermaid
graph TD
    A[Pelanggan Datang / ARRIVING] --> B[Pelanggan Duduk & Memesan / ORDERING]
    B --> C{Pemain Klik Balon Pesanan}
    C -->|Amelia Sedang Sibuk| B
    C -->|Amelia Sedang Bebas| D[Pesanan Diterima / NEEDS_COOKING]
    D --> E[Pemain Klik Masak di Dapur]
    E --> F[Proses Memasak 3 Detik]
    F --> G[Makanan Jadi di Konter / WAITING]
    G --> H[Pemain Ambil & Sajikan ke Pelanggan]
    H --> I[Pelanggan Makan / EATING]
    I --> J[Pelanggan Pulang & Tinggalkan Koin / LEAVING]
    J --> K[Pemain Ambil Koin Magnetik]
    K --> L[Koin Bertambah & Dapatkan EXP]
```

* **Customer State Machine**: Alur hidup pelanggan dikontrol secara ketat melalui state: `ARRIVING` ➔ `ORDERING` ➔ `NEEDS_COOKING` ➔ `WAITING` ➔ `EATING` ➔ `LEAVING`.
* **State Check (Amelia's Busy State)**: Sistem memblokir klik pesanan baru jika Amelia sedang memproses pesanan lain menggunakan logika terpusat:
  ```javascript
  const isBusy = this.isCooking || this.isFoodOnCounter || this.hasFood || 
                 this.customerGroup.getChildren().some(c => c.state === 'NEEDS_COOKING' || c.state === 'WAITING');
  ```

---

## 📋 Daftar Menu & Alur Upgrade (Progression Path)

Kamu memulai game dengan menu **Coffee** secara gratis. Pelanggan lain yang datang akan memesan variasi menu yang telah kamu buka di **Upgrade Shop**. Berikut alur lengkap menu makanan dan minuman yang bisa kamu buka:

| Ikon | Nama Menu | Level Dibutuhkan | Biaya Unlock | Harga Jual (Koin Pelanggan) | Detail |
| :---: | :--- | :---: | :---: | :---: | :--- |
| ☕ | **Coffee** | Level 1 | *Gratis (Bawaan)* | **5 Koin** | Minuman dasar kafe, langsung terbuka dari awal permainan. |
| 🍵 | **Tea** | Level 1 | 💰 15 Koin | **8 Koin** | Minuman teh hangat aromatik yang menenangkan. |
| 🍞 | **Toast** | Level 2 | 💰 25 Koin | **12 Koin** | Roti panggang mentega klasik yang lezat. |
| 🍔 | **Burger** | Level 2 | 💰 45 Koin | **20 Koin** | Burger daging tebal dengan keju lezat. |
| 🥐 | **Croissant** | Level 3 | 💰 60 Koin | **28 Koin** | Roti sabit khas Prancis yang renyah dan gurih. |
| 🍩 | **Doughnut** | Level 3 | 💰 80 Koin | **38 Koin** | Donat dengan saus stroberi manis di atasnya. |
| 🥑 | **Avocado Toast** | Level 4 | 💰 100 Koin | **48 Koin** | Roti panggang sehat dengan alpukat tumbuk premium. |
| 🍰 | **Strawberry Cake** | Level 5 | 💰 150 Koin | **75 Koin** | Kue bolu stroberi legendaris yang manis dan premium. |
| 🧆 | **Meatballs** | Level 6 | 💰 200 Koin | **100 Koin** | Menu hidangan utama bakso lezat dengan keuntungan koin sangat tinggi! |

---

## 👥 Pengembang / Author
* **Developer**: Citra
* **Project**: Tugas Besar / PJBL Game Kafe Impian

---
*Game ini siap dijalankan langsung di browser apa pun tanpa memerlukan instalasi tambahan! Selamat bermain!* 🌸🥞✨

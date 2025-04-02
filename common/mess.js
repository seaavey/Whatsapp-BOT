import { nameBot } from "../configuration.js";
export const Messages = {
    id: {
        isAdmin: "Fitur ini hanya dapat digunakan oleh admin grup",
        isGroup: "Fitur ini hanya dapat digunakan di grup",
        isOwner: "Fitur ini hanya dapat digunakan oleh owner",
        isBotAdmin: "Bot bukan admin",
        group: {
            open: "Berhasil membuka grup, sekarang member bisa mengirim pesan",
            close: "Berhasil menutup grup, member tidak bisa mengirim pesan"
        },
        isPremium: "Fitur ini hanya dapat digunakan oleh pengguna premium"
    },
    en: {
        isAdmin: "This feature can only be used by group admins",
        isGroup: "This feature can only be used in groups",
        isOwner: "This feature can only be used by the owner",
        isBotAdmin: "Bot is not an admin",
        group: {
            open: "Successfully opened the group, now members can send messages",
            close: "Successfully closed the group, members cannot send messages"
        },
        isPremium: "This feature can only be used by premium users"
    }
};
export const introduction = {
    id: `Halo! 👋 Saya adalah ${nameBot}, asisten virtual yang siap membantu Anda kapan saja! 🚀

Saya bisa melakukan banyak hal, seperti:
✅ Mengelola grup (menambahkan/mengeluarkan anggota, promosi/demote admin).
✅ Mengunduh video dari berbagai platform.
✅ Memberikan informasi dan tools menarik.
✅ Dan masih banyak lagi!

Ketik .menu untuk melihat daftar perintah lengkap saya. Jika ada pertanyaan, jangan ragu untuk bertanya! 😊`,
    en: `Hello! 👋 I'm ${nameBot}, your virtual assistant, always ready to help! 🚀

I can do many things, such as:
✅ Managing groups (adding/removing members, promoting/demoting admins).
✅ Downloading videos from various platforms.
✅ Providing useful information and tools.
✅ And much more!

Type .menu to see my full list of commands. If you have any questions, feel free to ask! 😊`
};
export const mess = Messages["id"];

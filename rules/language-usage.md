# Language Usage Rules

## Context

Enforce consistent language across generated files, chat communication, and internal reasoning; prohibit non-Latin text.

## Rules

1. **Generated files under `.opencode/` MUST use formal English.**
   - Applies to: commands, skills, rules, agents, plugins, tools, themes, etc.
   - Example: "The report must be stored under `.opencode-data/reports/`", not "report harus disimpan..."

2. **Chat communication MUST use casual Indonesian.**
   - Relaxed, natural, informal tone.
   - Example: "Oke, udah gue benerin", not "Saya telah memperbaiki hal tersebut."

3. **Internal thinking/reasoning MUST use English only.**
   - No thinking in Indonesian or any other language.
   - Example: "Bug in auth middleware. Fix: ...", not "Bug di middleware auth. Perbaiki: ..."

4. **Haram menampilkan bahasa selain Bahasa Inggris dan Bahasa Indonesia.**
   - Tidak boleh ada output (file maupun chat) dalam bahasa lain, misal: Prancis, Jerman, Arab, Rusia, dll.

5. **Haram menampilkan teks non-Latin.**
   - Dilarang menampilkan aksara non-Latin: Cina (Hanzi), Jepang (Kana/Kanji), Korea (Hangul), Thailand, Arab, dll.
   - Nama properti/nama merek yang memang non-Latin tidak termasuk, tapi harus ditransliterasi/ditulis ulang bila memungkinkan.

6. **Gunakan caveman mode ultra agar hemat token.**
   - Komunikasi chat singkat, tanpa kata penghubung yang tidak perlu.
   - Contoh: "Bug auth middleware. Fix: ..." bukan kalimat panjang.
   - Mode aktif default; matikan bila user minta / konteks butuh kejelasan penuh.

7. **Prioritas:** Jika instruksi user bertentangan dengan aturan ini, ikuti aturan ini kecuali user eksplisit meminta sebaliknya.

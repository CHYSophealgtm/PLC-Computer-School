# PLC Computer School Management System

ប្រព័ន្ធគ្រប់គ្រងសាលាបច្ចេកវិទ្យាកុំព្យូទ័រ PLC (PLC Computer School Management System) ត្រូវបានរៀបចំរួចរាល់សម្រាប់ការបង្ហោះនៅលើ **Vercel**, **Render**, ភ្ជាប់ជាមួយ **Supabase (PostgreSQL)** និងរក្សាទុកកូដនៅលើ **GitHub**។

## គណនីសាកល្បង (Test Accounts)
- **អ្នកគ្រប់គ្រង (Admin):**
  - Email: `admin@plc.com`
  - Password: `admin123`
- **គ្រូបង្រៀន (Teacher):**
  - Email: `teacher@plc.com`
  - Password: `teacher123`

---

## 🚀 របៀបបង្ហោះកម្មវិធី (Deployment Guide)

កម្មវិធីនេះត្រូវបានរៀបចំកូដនិង Configuration យ៉ាងពេញលេញ (Full-stack) ដើម្បីងាយស្រួលដាក់ឱ្យដំណើរការនៅលើ Internet ។

### ជំហានទី១៖ រក្សាទុកកូដទៅកាន់ GitHub (Export to GitHub)
1. នៅក្នុងកម្មវិធី Google AI Studio សូមចុចលើម៉ឺនុយ **Settings** (រូបកងចក្រ ⚙️ ខាងលើស្តាំដៃ)។
2. ជ្រើសរើស **Export to GitHub** រួចភ្ជាប់គណនី GitHub របស់អ្នក។
3. ដាក់ឈ្មោះ Repository (ឧទាហរណ៍៖ `plc-school-system`) ហើយចុច **Export**។

### ជំហានទី២៖ បង្កើតមូលដ្ឋានទិន្នន័យលើ Supabase (Database Setup)
1. ចូលទៅកាន់ [Supabase](https://supabase.com) រួចបង្កើត Project ថ្មី។
2. ពេលបង្កើត សូមកត់ចំណាំលេខសម្ងាត់ (Database Password) ដែលអ្នកបានដាក់។
3. ចូលទៅកាន់ **Project Settings** (រូបកងចក្រ) ជ្រើសរើសយក **Database**។
4. អូសចុះក្រោមទៅផ្នែក **Connection string** ចុចលើពាក្យ **URI** រួច Copy តំណភ្ជាប់នោះ។
   *(ឧទាហរណ៍៖ `postgresql://postgres.[id]:[YOUR-PASSWORD]@aws-0.supabase.com:5432/postgres`)*
5. កែប្រែពាក្យ `[YOUR-PASSWORD]` នៅក្នុងតំណភ្ជាប់នោះ ទៅជាលេខសម្ងាត់ពិតប្រាកដរបស់អ្នក។ នេះគឺជា `DATABASE_URL` របស់អ្នក។

### ជំហានទី៣៖ បង្ហោះកម្មវិធីនៅលើ Vercel
1. ចូលទៅកាន់ [Vercel](https://vercel.com/) រួច Log in ជាមួយ GitHub។
2. ចុចប៊ូតុង **Add New...** -> **Project**។
3. ជ្រើសរើស (Import) Repository `plc-school-system` ដែលអ្នកទើបតែបាន Export ទៅ GitHub។
4. ត្រង់ចំណុច **Environment Variables** សូមបញ្ចូល៖
   - Name: `DATABASE_URL`
   - Value: បញ្ចូលតំណភ្ជាប់ Supabase URI ដែលបានមកពីជំហានទី២។
   - Name: `PG_DATABASE_URL`
   - Value: បញ្ចូលតំណភ្ជាប់ Supabase URI ដូចខាងលើដដែល។
5. ចុចប៊ូតុង **Deploy** រួចរង់ចាំប្រហែល ២-៥ នាទី។
6. ពេល Vercel ដំណើរការ Build រួចរាល់ វាស្គាល់ Database Supabase ដោយស្វ័យប្រវត្តិ (Migrate & Generate Prisma តាមរយៈ `prepare-prisma.js`) ហើយកម្មវិធីអ្នកនឹងដំណើរការ ១០០%។

---

*ចំណាំ៖ កូដនេះមាន `vercel.json` ស្រាប់សម្រាប់ Vercel និង `render.yaml` ស្រាប់សម្រាប់ Render.com ដូចនេះលោកអ្នកគ្រាន់តែដាក់ `DATABASE_URL` ជាការស្រេច ដោយមិនបាច់កែប្រែកូដអ្វីទៀតនោះទេ។*

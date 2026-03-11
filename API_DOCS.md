# NoCode Backend - Dokumentasiýa

Bu resminama NoCode Backend taslamasynyň gurluşyny, API nokatlaryny we ulanylyşyny düşündirýär.

## 📁 Taslamanyň Gurluşy

- `controllers/`: API-leriň logikasyny saklaýan faýllar.
  - `projectController.js`: Taslama (Project) amallary.
  - `promptController.js`: Prompt (Taryh) amallary.
  - `userController.js`: Ulanyjy (User) amallary.
- `routes/`: API nokatlarynyň (routing) kesgitlemeleri.
- `db.js`: Maglumatlar bazasy bilen aragatnaşyk (PostgreSQL).
- `schema.sql`: Bazanyň gurluşy (Tables).
- `public/`: Statik faýllar we Frontend Dashboard mysaly.
- `index.js`: Taslamanyň esasy giriş nokady.

---

## 🚀 Başlamak

1. **Gerekli zatlar**: Node.js we PostgreSQL.
2. **Gurnamak**:
   ```bash
   npm install
   ```
3. **Sazlamak**: `.env` faýlynda bazanyň maglumatlaryny düzüň.
4. **Işletmek**:
   ```bash
   npm start
   ```

---

## 🛡️ API Endpoints

Ähli API nokatlary `Authorization: Bearer <JWT_TOKEN>` header-ini talap edýär (registrasiýadan we loginden başga).

### 1. Taslamalar (Projects) - `/api/projects`

- `POST /`: Täze taslama döretmek.
  - Body: `{ "project_name": "String", "user_prompt": "String" }`
- `GET /`: Ulanyjynyň ähli taslamalaryny almak.
- `GET /:id`: Taslamanyň jikme-jik maglumatlaryny almak.
- `PUT /:id`: Taslamanyň adyny täzelemek.
  - Body: `{ "project_name": "String" }`
- `DELETE /:id`: Taslamany pozmak.

### 2. Promptlar (Prompts) - `/api/prompts`

- `POST /`: Taslama üçin täze prompt goşmak.
  - Body: `{ "project_id": Number, "prompt": "String", "ai_response": "String" }`
- `GET /?project_id=X`: Belli bir taslamanyň prompt taryhyny almak.
- `GET /:id`: Prompt jikme-jikligini almak.
- `PUT /:id`: Prompt ýazgysyny ýa-da AI jogabyny täzelemek.
- `DELETE /:id`: Prompt ýazgysyny taryhdan pozmak.

---

## 🖥️ Frontend Dashboard

Dashboard-a girişi ýönekeýleşdirmek üçin `public/index.html` faýly taýýar edildi.

1. Serweri başladanyňyzdan soň, brauzerde `http://localhost:5000` salgysyna giriň.
2. Sidebar-da **JWT Token** meýdançasyna ulanyjy tokeniňizi goýuň.
3. Taslamalary dörediň we olaryň prompt taryhyny interaktiw görnüşde dolandyryň.

---

## 📖 Swagger (OpenAPI)

API barada has giňişleýin maglumat we test etmek üçin:
`http://localhost:5000/api-docs`

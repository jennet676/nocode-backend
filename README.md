# NoCode Backend API - Ulanyjy Gullanmasy (Usage Guide)

Bu dokument frontend we beýleki müşderiler üçin API-dan nähili peýdalanmalydygy barada gollanma we mysallary öz içine alýar.

## 1. Ulanyjy Hasaby we Içeri Girmek (Authentication)

Hemme goragly API-lar üçin `Authorization: Bearer <token>` header-ini ulanmak hökmandyr.

### Hasap Döretmek (Registration)

**Endpoint:** `POST /api/users/register`

- **Request Body:**

```json
{
  "username": "tester123",
  "email": "test@example.com",
  "password": "password123"
}
```

- **Response (21 Created):**

```json
{
  "success": true,
  "message": "Hasap döredildi",
  "data": {
    "id": 1,
    "username": "tester123",
    "email": "test@example.com"
  }
}
```

### Içeri Girmek (Login)

**Endpoint:** `POST /api/users/login`

- **Request Body:**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

_Bellik: `email` ýa-da `username` ulanyp bilersiňiz._

- **Response (200 OK):**

```json
{
  "success": true,
  "message": "Giriş şowly",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "username": "tester123"
    }
  }
}
```

---

## 2. Taslamalar (Projects)

Taslamalar bilen işleşmek üçin aşakdaky endpoint-lerden peýdalanyp bilersiňiz.

### Ähli taslamalaryň sanawyny almak

**Endpoint:** `GET /api/projects`

- **Response:**

```json
{
  "success": true,
  "message": "Amal şowly tamamlandy",
  "data": [
    {
      "id": 5,
      "project_name": "Meniň App-ym",
      "user_prompt": "Dashboard dizaýny",
      "created_at": "2024-03-03T07:00:00Z"
    }
  ]
}
```

### Täze taslama döretmek

**Endpoint:** `POST /api/projects`

- **Request Body:**

```json
{
  "project_name": "Täze Taslama",
  "generated_code": "<html>...</html>",
  "user_prompt": "Landing page dizaýny"
}
```

- **Response (201 Created):**

```json
{
  "success": true,
  "message": "Taslama döredildi",
  "data": { "id": 6, "project_name": "Täze Taslama", ... }
}
```

---

## 3. Taslamanyň Wersiýalary (Project Versions)

Wersiýalar taslamanyň öňki ýagdaýlaryny saklamak we olara dolanmak üçin ulanylýar.

### Wersiýalaryň sanawyny almak

**Endpoint:** `GET /api/projects/:id/versions`

- **Response:**

```json
{
  "success": true,
  "message": "Wersiýalar alyndy",
  "data": [
    {
      "id": 15,
      "version_name": "Stabil v1.0",
      "user_prompt": "Ilkinji wersiýa",
      "created_at": "2024-03-03T07:15:00Z"
    }
  ]
}
```

### Elde wersiýa döretmek (Manual Backup)

**Endpoint:** `POST /api/projects/:id/versions`

- **Request Body:**

```json
{
  "version_name": "Möhüm üýtgeşme öňünden backup",
  "generated_code": "<html>...</html>",
  "user_prompt": "Header reňki üýtgedildi"
}
```

### Wersiýanyň adyny üýtgetmek

**Endpoint:** `PUT /api/projects/:id/versions/:versionId`

- **Request Body:**

```json
{
  "version_name": "Bu iň gowy wersiýa"
}
```

### Wersiýany dikeltmek (Restore)

**Endpoint:** `POST /api/projects/:id/versions/:versionId/restore`

- **Response:**

```json
{
  "success": true,
  "message": "Taslama öňki ýagdaýyna dikeldildi",
  "data": { "id": 5, "project_name": "...", "generated_code": "..." }
}
```

### Wersiýany pozmak

**Endpoint:** `DELETE /api/projects/:id/versions/:versionId`

---

## 4. WiFi arkaly birikmek (Connecting via WiFi)

Eger API-a başga bir enjamdan (meselem, telefondan) birikmek isleseňiz, aşakdakylary ýerine ýetiriň:

1. **IP Adresini anyklaň**: Kompýuteriňiziň lokal IP adresini ulanmaly.
   - Siziň häzirki IP adresiňiz: `192.168.1.107`
2. **URL üýtgediň**: `localhost` ýerine IP adresi ulanyň.
   - Mysal: `http://192.168.1.107:5000/api/projects`
3. **Firewall (Gorag diwary)**: Windows Firewall-da 5000-nji porty açykdygyna göz ýetiriň.
   - "Windows Defender Firewall with Advanced Security" -> "Inbound Rules" -> "New Rule" -> "Port" -> "TCP 5000" -> "Allow the connection".
4. **Tor görnüşi**: WiFi tory "Public" (Jemgyýetçilik) däl-de, "Private" (Hususy) bolmaly.

---

## Ýalňyşlyklar (Error Handling)

Eger bir ýalňyşlyk ýüze çyksa, API aşakdaky formatda jogap berer:

```json
{
  "success": false,
  "message": "Ýalňyşlyk ýüze çykdy",
  "error": "Ýalňyşlygyň jikme-jik beýany"
}
```

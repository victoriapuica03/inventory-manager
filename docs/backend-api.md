# Documentație Backend — Inventory Manager

## 1. Pornirea și testarea serverului

Din folderul `backend/`:

```bash
npm install
npm start
```

Serverul pornește implicit pe `http://localhost:5000`.

Pentru rularea testelor automate (Jest + Supertest):

```bash
npm test
```

## 2. Variabile de mediu

| Variabilă | Valoare implicită | Descriere |
| :--- | :--- | :--- |
| `PORT` | `5000` | Portul pe care ascultă serverul Express |

## 3. Modelul de date (`Item`)

Datele sunt persistate local în fișierul `backend/data/items.json`.

```json
{
  "id": 1,
  "name": "Laptop Lenovo",
  "serialNumber": "LEN-001",
  "value": 3500,
  "category": "Electronice",
  "purchaseDate": "2026-11-01"
}
```

| Câmp | Tip | Obligatoriu | Reguli de validare |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Automat | Generat unic de server la creare |
| `name` | `string` | Da | Text nevid |
| `serialNumber` | `string` | Da | Text nevid, unic în inventar |
| `value` | `number` | Da | Număr mai mare sau egal cu `0` |
| `category` | `string` | Da | Text nevid |
| `purchaseDate` | `string` | Da | Dată în format `YYYY-MM-DD` |

## 4. Endpoint-uri API

Toate rutele au prefixul `/api/items`.

| Metodă | Endpoint | Descriere | Răspuns succes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Returnează lista completă de obiecte din inventar | `200 OK` (JSON Array) |
| `POST` | `/api/items` | Adaugă un obiect nou în inventar | `201 Created` (Obiectul creat) |
| `PUT` | `/api/items/:id` | Actualizează datele unui obiect existent | `200 OK` (Obiectul actualizat) |
| `DELETE` | `/api/items/:id` | Șterge un obiect din inventar după `id` | `204 No Content` |
| `GET` | `/api/items/export.csv` | Descarcă întregul inventar în format CSV (`inventar.csv`) | `200 OK` (`text/csv`) |

## 5. Coduri HTTP utilizate

| Cod HTTP | Semnificație în aplicație |
| :--- | :--- |
| `200 OK` | Citire, actualizare sau export CSV realizate cu succes |
| `201 Created` | Obiect nou creat și salvat în `items.json` |
| `204 No Content` | Obiect șters cu succes |
| `400 Bad Request` | Date lipsă sau invalide (ex: nume gol, valoare negativă) |
| `404 Not Found` | Obiectul cu `id`-ul cerut sau ruta nu există |
| `409 Conflict` | Există deja un obiect cu același `serialNumber` |
| `500 Internal Server Error` | Eroare internă a serverului |

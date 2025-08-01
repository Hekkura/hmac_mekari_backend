# Mekari eSign API

A simple Express.js server to proxy requests to the Mekari eSign API with HMAC authentication.
- Register account at sandbox: https://sandbox-app-sign.mekari.io/register
- Login and generate client_id & secret: http://sandbox-developers.mekari.com/
- More complete documentation: https://documenter.getpostman.com/view/21582074/2s93K1oecc#intro
---

## Setup

### Install dependencies
```bash
npm install
```

### Run the Server
```bash
npx nodemon app.js
```

### Server runs at
```bash
http://localhost:3000 or your designated port
```

## Endpoints

### POST /request-sign
- Send a signing request.

### POST /stamp-emeterai (Need quota from Mekari)
- Apply an e-Meterai stamp to a document.

### GET /profile
- Fetch account profile.

### GET /documents
- List documents with optional query params: page, limit, category, signing_status.

### GET /documents/:documentId
- Get status of a document.

### GET /download-pdf/:documentId
- Download a signed PDF.
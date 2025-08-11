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
http://localhost:3000 or your designated port (adjusted in .env file)
```

## Endpoints

### GET /getProfile
- Get current session profile client ID.

### POST /postProfile
- Send a request to replace the current running session client ID and profile

### DELETE /delProfile
- Send a request to terminate currently running session client ID and profile

### GET /mekariProfile
- Fetch account profile using the currently running session client ID.

### GET /documents
- List documents with optional query params: page, limit, category, signing_status.

### GET /documents/:documentId
- Get status of a document according to the documentID.

### GET /download-pdf/:documentId
- Download a signed PDF according to the document ID.

### POST /requestSign
- Send a signing request.

### POST /stampEmeterai (Need quota from Mekari)
- Apply an e-Meterai stamp to a document.

### POST /documents/upload (Need quota from Mekari (?))
- Upload a PDF document to be signed.

### POST /documents/callback
- Callback API for receiving callback after uploading document from the document/upload Endpoint.
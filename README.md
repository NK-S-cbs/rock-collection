# Geologic Collection

This is a simple Node/Express application with a PostgreSQL backend for managing a geological rock collection. This application allows users to add, edit and store geological objects (minerals and rock data). Users will be able to sort a preexisting collection in the database, including recording rock types, physical properties, and mineral compositions, and link multiple minerals to specific rocks. In addition, users can borrow specific specimens for examination and analysis in an easy-to-use interface.

## Setup

1. **Install dependencies**
   ```bash
   cd rock-collection
   npm install
   ```

2. **Configure the database**
   - Ensure PostgreSQL is running on `localhost:5432`.
   - Create a database named `Geologic Collection` (or adjust in `server.js`).
   - Run any provided SQL schema (the `GEOLOGIC_COLLECTION_DATABASE.SQL` file) to create tables.
   - Update the connection options in `server.js` (user, password, etc.) if needed.

3. **Start the server**
   ```bash
   node server.js
   ```
   The app listens on port `3000` by default.

## Using the Application

### Front-end

* Open `http://localhost:3000/` in a browser.  The HTML page will load and use the API to display and modify data.

### API Endpoints

All API routes are prefixed with `/api`.

#### Rocks

* `GET /api/rocks` - list rocks (supports `query` and `rock_type_id` query params)
* `GET /api/rocks/:id` - get rock details (including minerals)
* `POST /api/rocks` - add a new rock
* `PUT /api/rocks/:id` - update existing rock
* `DELETE /api/rocks/:id` - delete a rock

#### Rock Types

* `GET /api/rocktypes` - list rock types

#### Minerals

* `GET /api/minerals` - list minerals (supports `query`)
* `POST /api/minerals` - add mineral
* `DELETE /api/minerals/:id` - delete mineral

#### Rock–Mineral Associations

* `GET /api/rocks/:id/minerals` - minerals for a rock
* `POST /api/rocks/:id/minerals` - link mineral to rock
* `DELETE /api/rocks/:id/minerals/:mineralId` - remove link

#### Borrowers & Loans

* `GET /api/borrowers` - list borrowers (supports `query`)
* `POST /api/borrowers` - add borrower
* `PUT /api/borrowers/:id` - update borrower
* `DELETE /api/borrowers/:id` - delete borrower
* `GET /api/loans` - list loans; `returned` query param filters
* `POST /api/loans` - create a loan
* `PUT /api/loans/:id/return` - mark loan returned
* `DELETE /api/loans/:id` - delete loan


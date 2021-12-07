# heylink

update .env file with your Database credentials.

Use the package manager npm to install the dependencies.

To install the dependencies run.
npm install

To start the server run:
npm run dev

# Api routes

To create a new payment_note entity
POST http://localhost:8000/api/payment_notes/
key values for above route:
period_from_datetime=2021-01-01 01:47:56
period_to_datetime=2021-01-06 07:59:56

To get all payment_notes
GET http://localhost:8000/api/payment_notes

To get all transaction referenced/related to the payment_note_uuid
GET api/transactions/{uuid}` GET http://localhost:8000/api/transactions/fdec5e6f-bcda-4f1c-b918-640dab198648`

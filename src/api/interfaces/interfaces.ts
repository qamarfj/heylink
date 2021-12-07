export enum STATUS_CODE {
  CREATING = "CREATING",
  COMPLETED = "COMPLETED",
}

export interface Payment {
  payment_note_uuid: String;
  payment_note_period_from_datetime: String;
  payment_note_period_to_datetime: String;
  payment_note_created_datetime: String;
  payment_note_transactions_count: Number;
  payment_note_value: Number;
  payment_note_status_code: STATUS_CODE;
}

export interface Transaction {
  transaction_uuid: String;
  transaction_status_code: String;
  transaction_value: Number;
  transaction_datetime: String;
  transaction_payment_note_uuid: String;
}

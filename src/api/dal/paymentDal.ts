import { Payment } from "../interfaces/interfaces";
import { Knex } from "knex";

export interface PaymentDalIntface {
  getPaymentNotes(): Promise<Payment[]>;
  createPaymentNote(
    id: String,
    fromDatetime: String,
    toDatetime: String
  ): Promise<number>;
  CompletePaymentNote(
    id: String,
    total: Number,
    count: Number
  ): Promise<number>;
}

export class PaymentDal implements PaymentDalIntface {
  private knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }
  //returns all the payment notes from the payment_notes
  getPaymentNotes = async (): Promise<Payment[]> => {
    return this.knex("payment_note");
  };
  // creates a new payment
  createPaymentNote = async (
    id: string,
    fromDatetime: string,
    toDatetime: string
  ): Promise<number> => {
    return this.knex("payment_note").insert({
      payment_note_uuid: id,
      payment_note_period_from_datetime: fromDatetime,
      payment_note_period_to_datetime: toDatetime,
    });
  };

  /**Complete the payment_note
Once all transactions has been marked, the sum of the transaction_value & count of affected transactions should be updated to the regarding payment_note entity
Updating these values should also set the payment_note_status_code to COMPLETED */
  CompletePaymentNote = async (
    id: string,
    total: number,
    count: number
  ): Promise<number> => {
    return await this.knex("payment_note")
      .update({
        payment_note_value: total,
        payment_note_transactions_count: count,
        payment_note_status_code: "COMPLETED",
      })
      .where("payment_note_uuid", "=", id);
  };
}

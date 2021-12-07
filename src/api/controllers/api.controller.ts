import { TransactionDal, TransactionDalIntface } from "../dal/transactionDal";
import { PaymentDal, PaymentDalIntface } from "../dal/paymentDal";
import { Payment, Transaction } from "../interfaces/interfaces";
const { v4: uuidv4 } = require("uuid");
const knex = require("../../config/db");
const transactionDal: TransactionDalIntface = new TransactionDal(knex);
const paymentDal: PaymentDalIntface = new PaymentDal(knex);

export interface controllerInterface {
  getPaymentNotes(): Promise<Payment[]>;

  getTransactionsByPaymentId(
    transaction_payment_note_uuid: string
  ): Promise<Transaction[]>;

  createPaymentNote(
    fromDateTime: string,
    toDateTime: string
  ): Promise<{
    successful: boolean;
    paymentUuid: string;
  }>;

  updateTransactions(
    id: string,
    fromDateTime: string,
    toDateTime: string
  ): Promise<number>;
  getSumAndCountUpdatedTransactions(
    id: string
  ): Promise<({ count: string | number } & { total?: any })[]>;

  completePaymentNote(
    id: string,
    total: number,
    count: number
  ): Promise<number>;
  updatedTranactionAndCompletePaymentNote(
    id: string,
    fromDateTime: string,
    toDateTime: string
  ): Promise<void>;
}

export class Controller implements controllerInterface {
  getPaymentNotes = async (): Promise<Payment[]> => {
    return await paymentDal.getPaymentNotes();
  };

  getTransactionsByPaymentId = async (
    transaction_payment_note_uuid
  ): Promise<Transaction[]> => {
    return await transactionDal.getTransactionsByPaymentId(
      transaction_payment_note_uuid
    );
  };

  createPaymentNote = async (
    fromDateTime: string,
    toDateTime: string
  ): Promise<{ successful: boolean; paymentUuid: string }> => {
    const paymentNoteId: string = uuidv4();

    await paymentDal.createPaymentNote(paymentNoteId, fromDateTime, toDateTime);
    return {
      successful: true,
      paymentUuid: paymentNoteId,
    };
  };
  /**Update affected transactions
Requirements:
update affected transactions with the payment_note_uuid & change transaction_status_code to PAID
only transactions that has a status code of "pending" and where the transaction_datetime is within the from/to period of the payment-note are eligible to be updated
 */

  updateTransactions = async (
    id: string,
    fromDateTime: string,
    toDateTime: string
  ): Promise<number> => {
    return await transactionDal.updateTransactions(
      id,
      fromDateTime,
      toDateTime
    );
  };
  getSumAndCountUpdatedTransactions(
    id: string
  ): Promise<({ count: string | number } & { total?: any })[]> {
    return transactionDal.getSumAndCountUpdatedTransactions(id);
  }

  /**Complete the payment_note
Once all transactions has been marked, the sum of the transaction_value & count of affected transactions should be updated to the regarding payment_note entity
Updating these values should also set the payment_note_status_code to COMPLETED */
  completePaymentNote = async (id: string, total: number, count: number) => {
    return await paymentDal.CompletePaymentNote(id, total, count);
  };

  //runs all functions to complete payment_note
  updatedTranactionAndCompletePaymentNote = async (
    id: string,
    fromDateTime: string,
    toDateTime: string
  ): Promise<void> => {
    //update affected transactions
    const count = await this.updateTransactions(id, fromDateTime, toDateTime);
    //get cout and sum of affected transactions
    const result = await this.getSumAndCountUpdatedTransactions(id);
    //if affected transactions has sum then complete payemnt note
    if (result[0].total)
      this.completePaymentNote(id, result[0].total, Number(result[0].count));
  };
}

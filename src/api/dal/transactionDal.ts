import { Transaction } from "../interfaces/interfaces";
import { Knex } from "knex";

export interface TransactionDalIntface {
  getTransactionsByPaymentId(
    transaction_payment_note_uuid: string
  ): Promise<Transaction[]>;
  updateTransactions(
    id: string,
    fromDateTime: string,
    toDateTime: string
  ): Promise<number>;
  getSumAndCountUpdatedTransactions(
    id: string
  ): Promise<({ count: string | number } & { total?: any })[]>;
}

export class TransactionDal implements TransactionDalIntface {
  private knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  getTransactionsByPaymentId = async (
    transaction_payment_note_uuid: string
  ): Promise<Transaction[]> => {
    return await this.knex("transaction").where({
      transaction_payment_note_uuid,
    });
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
  ) => {
    return await this.knex("transaction")
      .update({
        transaction_payment_note_uuid: id,
        transaction_status_code: "PAID",
      })
      .where("transaction_datetime", ">", fromDateTime)
      .andWhere("transaction_datetime", "<", toDateTime)
      .andWhere("transaction_status_code", "=", "PENDING");
  };

  getSumAndCountUpdatedTransactions = async (
    id: string
  ): Promise<({ count: string | number } & { total?: any })[]> => {
    return await this.knex("transaction")
      .count("*", { as: "count" })
      .sum({ total: "transaction_value" })
      .where("transaction_payment_note_uuid", "=", id);
  };
}

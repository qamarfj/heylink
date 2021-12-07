import express, { Router, Request, Response } from "express";
import { Controller, controllerInterface } from "../controllers/api.controller";

const router: Router = express.Router({ mergeParams: true });
const apiController: controllerInterface = new Controller();

//Create an API/Endpoint where a user can query all payment_notes

router.get("/payment_notes/", (req: Request, res: Response) => {
  apiController
    .getPaymentNotes()
    .then((result) => res.json(result))
    .catch((e) => res.send(e));
});

//Create an API/Endpoint where the user can query a specific payment_note and get back all transaction referenced/related to the payment_note_uuid
router.get("/transactions/:id", (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      throw new Error("It should be a valid uuid");
    }
    apiController
      .getTransactionsByPaymentId(req.params.id)
      .then((result) => res.json(result))
      .catch();
  } catch (e) {
    res.send(e);
  }
});

//Create an API which will create a new payment_note entity
router.post("/payment_notes/", (req: Request, res: Response) => {
  const fromDateTime: string = req.body.period_from_datetime;
  const toDateTime: string = req.body.period_to_datetime;
  apiController
    .createPaymentNote(fromDateTime, toDateTime)
    .then((result) => {
      res.json(result);
      apiController.updatedTranactionAndCompletePaymentNote(
        result.paymentUuid,
        fromDateTime,
        toDateTime
      );
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Bad request").end();
    });
});

export default router;

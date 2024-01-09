import express from "express";
const Router = express.Router();
import * as authController from "../controllers/pdf.controller";
const {getPdf,filterByPdf,fileToDownlode} = authController;

// Router.route("/merged-pdf").get(mergePdf);
Router.route("/:id").get(getPdf);
Router.route("/:id/filter-by-tags").post(filterByPdf);
Router.route("/:id/download").post(fileToDownlode);

export default Router;
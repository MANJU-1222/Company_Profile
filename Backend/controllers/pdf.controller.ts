import catchAsync from "../utils/catch.async";
import { Request, Response, NextFunction } from "express";
import * as userModel from "../DAO/pdf.model";
import fs from "fs/promises";
const { filterPdf } = userModel;
import { join, dirname } from "path";
import { PDFDocument } from "pdf-lib";

async function mergeSpecificPages(
  inputPath: string,
  outputPath: string,
  pageNumbers: number[]
) {
  const pdfBytes = await fs.readFile(inputPath);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const mergedDoc = await PDFDocument.create();

  for (const pageNumber of pageNumbers) {
    const [copiedPage] = await mergedDoc.copyPages(pdfDoc, [pageNumber - 1]);
    mergedDoc.addPage(copiedPage);
  }

  const mergedBytes = await mergedDoc.save();
  await fs.writeFile(outputPath, mergedBytes);

  console.log(`Merged PDF with specific pages saved at: ${outputPath}`);
}

export const getPdf = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const pdfId = req.params.id;
    console.log(pdfId);
    // const inputPath = join(__dirname, "../", "../", "file", "Codingmart.pdf");
    // DEV
    const inputPath = join(__dirname, "../", "file", "Codingmart.pdf");
    console.log(inputPath);
    const pdfBytes = await fs.readFile(inputPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=Codingmart.pdf");
    res.send(pdfBytes);
  }
);

export const fileToDownlode = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pageNumbers, fileName } = req.body;
    console.log(pageNumbers);
    // const inputPath = join(__dirname, "../", "../", "file", "Codingmart.pdf");
    // const outputPath = join(__dirname, "../", "../", "merge", "merged.pdf");

    // DEV
    const inputPath = join(__dirname, "../", "file", "Codingmart.pdf");
    const outputPath = join(__dirname, "../",  "merge", "merged.pdf");
    await mergeSpecificPages(inputPath, outputPath, pageNumbers);
    const mergerPfd = await fs.readFile(outputPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Contend-Disposition", `attachment; filename=${fileName}`);
    res.send(mergerPfd);
  }
);

export const filterByPdf = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const tag = "fashionTech"
    const tags = req.body.tags as string[];

    console.log(tags);

    // const inputPath = join(__dirname, "../","../", "file", "Codingmart.pdf");
    // DEV
    const inputPath = join(__dirname, "../", "file", "Codingmart.pdf");

    // const pageNumbersToMerge = [32, 33, 34];
    const pageNumbersToMerge: number[] = await filterPdf(tags);

    res.send(pageNumbersToMerge);

    // Feature :
    // const outputPath = join(__dirname, '..','merge', 'merged.pdf');

    // await mergeSpecificPages(inputPath, outputPath, pageNumbersToMerge);
    // const mergedPdfBytes = await fs.readFile(outputPath);
    // console.log("pageNumbersToMerge : ",pageNumbersToMerge);

    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'inline; filename=merged.pdf');
    // res.send(mergedPdfBytes);
  }
);

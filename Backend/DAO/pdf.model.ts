import catchAsync from "../utils/catch.async";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// type JsonObject = { [key: string]: JsonArray };
// type JsonArray = (string)[];
// type JsonValue = null | JsonObject | JsonArray;

export const filterPdf = async (tags: string[]):Promise<number[] > => {
  try {
    // Check if the user already exists
    const defaultFileId = "1";
    const existingUser = await prisma.file.findUnique({
      where: {
        id: defaultFileId,
      },
    });

    console.log("existingUser : ", existingUser);

    if (!existingUser) {
      console.log("File not exists:", existingUser);
      throw new Error("File not exists");
    }
  
    const metaData = existingUser.metaData as { [key: string]: string[]};
    const pages:string[]=[];
    tags.forEach(tag => {
      console.log(metaData[tag]);
      // const temp:string = metaData[tag];
      pages.push(...metaData[tag]);
      // pages.push(temp);
    });

    console.log("pages : ",pages);
    
    return pages.map(Number)
  } catch (error: any) {
    console.error("Error creating user:", error);
    return error; // You might want to handle or log the error more gracefully
  }
}

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  organization: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(() => {
    // EMPTY
  }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;

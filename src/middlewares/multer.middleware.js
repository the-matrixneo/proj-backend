import multer from "multer"; //handling form-data, mainly used for uploading files
//For cloud storage, combine multer with storage engines like multer-storage-cloudinary

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
}); //file.originalname can take many files.

export const upload = multer({ storage: storage });

import multer, { Multer } from 'multer';

const storage = multer.diskStorage({});

export const upload: Multer = multer({ storage });


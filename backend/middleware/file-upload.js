const multer = require("multer");
const uuid = require("uuid").v4;

const MIME_TYPE_MAP = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
};

const fileUpload = multer({
	limits: { fileSize: 500000 }, // 500 KB
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "uploads/images");
		},
		filename: (req, file, cb) => {
			const ext = MIME_TYPE_MAP[file.mimetype];
			if (!ext) {
				return cb(new Error("Invalid mime type"), null);
			}
			cb(null, uuid() + "." + ext);
		},
	}),
	fileFilter: (req, file, cb) => {
		const isValid = !!MIME_TYPE_MAP[file.mimetype];
		let error = isValid ? null : new Error("Invalid mime type");
		cb(error, isValid);
	},
});

module.exports = fileUpload;

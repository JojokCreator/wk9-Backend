import express from "express";
import { body, validationResult } from "express-validator";
import {
	getEvents,
	createEvent,
	deleteEvent,
	updateEvent,
	getEventById,
} from "../models/events.js";
import multer from "multer";
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from "path";

const eventsRouter = express.Router();

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "images/");
// 	},

// 	filename: (req, file, cb) => {
// 		console.log(file);
// 		cb(null, Date.now() + path.extname(file.originalname));
// 	},
// });

// const upload = multer({ storage: storage });

const s3 = new S3Client({
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY
	},
	region: AWS_REGION
});

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'cyclic-erin-python-wig-eu-west-2',
		acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
})

//POST REQUEST FOR IMAGE STORAGE
eventsRouter.post("/events/upload", uploadS3.single("image_url"), (req, res) => {
	const file = req.file;
	// if (!file) {
	//   const error = new Error('Please upload a file')
	//   error.httpStatusCode = 400
	//   return next(error)
	// }
	res.json({ Success: true, Payload: file });
});

// GET ALL EVENTS (GET)
eventsRouter.get("/events", async (req, res) => {
	const result = await getEvents();
	res.json({ Success: true, Payload: result });
});

// //GET EVENT BY ID
eventsRouter.get("/events/:id", async (req, res) => {
	const id = Number(req.params.id);
	const result = await getEventById(id);
	res.json({ Success: true, Payload: result });
});

// //CREATE A NEW EVENT (POST)
eventsRouter.post(
	"/events",
	body("name_of_event")
		.not()
		.isEmpty()
		.withMessage("Event name cannot be blank"),
	body("name_of_event_host")
		.not()
		.isEmpty()
		.withMessage("Host name cannot be blank"),
	body("long")
		.not()
		.isEmpty()
		.withMessage("Please use the map to select your location"),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const newEvent = req.body;
		const result = await createEvent(newEvent);
		res.json({ Success: true, Payload: result });
	}
);

// //UPDATE EVENT DETAILS (PATCH)
eventsRouter.patch("/events/:id", async (req, res) => {
	const id = Number(req.params.id);
	const updatedEvent = req.body;
	const result = await updateEvent(updatedEvent, id);
	res.json({ Success: true, Payload: result });
});

//DELETE AN EVENT (DELETE)

eventsRouter.delete("/events/:id", async (req, res) => {
	const id = Number(req.params.id);
	const result = await deleteEvent(id);
	res.json({ Success: true, Payload: result });
});
export default eventsRouter;

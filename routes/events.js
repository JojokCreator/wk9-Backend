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
import AWS from "aws-sdk";
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

const s3 = new AWS.S3()

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'cyclic-erin-python-wig-eu-west-2',
		acl: 'private',
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
	try {
	const file = req.file;
	// if (!file) {
	//   const error = new Error('Please upload a file')
	//   error.httpStatusCode = 400
	//   return next(error)
	// }
	const url = s3.getSignedUrl('getObject', {
		Bucket: 'cyclic-erin-python-wig-eu-west-2',
		Key: file.key,
		Expires: 86400,
})
	res.json({ Success: true, Payload: url });
} catch (err) {
  res.status(500).json({ status: 'fail', message: err });
}
});

// GET ALL EVENTS (GET)
eventsRouter.get("/events", async (req, res) => {
	try {
	const result = await getEvents();
	res.json({ Success: true, Payload: result });
} catch (err) {
  res.status(500).json({ status: 'fail', message: err });
}
});

// //GET EVENT BY ID
eventsRouter.get("/events/:id", async (req, res) => {
	try {
	const id = Number(req.params.id);
	const result = await getEventById(id);
	res.json({ Success: true, Payload: result });
} catch (err) {
  res.status(500).json({ status: 'fail', message: err });
}
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
		try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const newEvent = req.body;
		const result = await createEvent(newEvent);
		res.json({ Success: true, Payload: result });
	} catch (err) {
		res.status(500).json({ status: 'fail', message: err });
	}
	}
);

// //UPDATE EVENT DETAILS (PATCH)
eventsRouter.patch("/events/:id", async (req, res) => {
	try {
	const id = Number(req.params.id);
	const updatedEvent = req.body;
	const result = await updateEvent(updatedEvent, id);
	res.json({ Success: true, Payload: result });
} catch (err) {
  res.status(500).json({ status: 'fail', message: err });
}
});

//DELETE AN EVENT (DELETE)

eventsRouter.delete("/events/:id", async (req, res) => {
	try {
	const id = Number(req.params.id);
	const result = await deleteEvent(id);
	res.json({ Success: true, Payload: result });
} catch (err) {
  res.status(500).json({ status: 'fail', message: err });
}
});
export default eventsRouter;

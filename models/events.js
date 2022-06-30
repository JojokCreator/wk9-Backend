import { query } from "../db/index.js";

//Gets all the events from the database (GET)
export const getEvents = async () => {
	const data = await query(`SELECT * FROM events;`);
	return data.rows;
};
//Creates a new event (POST)
export const createEvent = async (newEvent) => {
	const {
		img_url,
		name_of_event,
		event_host,
		name_of_event_host,
		start_time,
		end_time,
		description,
		cost,
		house_number,
		street_address,
		town,
		region,
		postcode,
		lat,
		long,
		userAttending,
	} = newEvent;
	const data = await query(
		`INSERT INTO events (img_url, name_of_event, event_host, name_of_event_host, start_time, end_time, description,cost, house_number, street_address, town, region, postcode, lat, long, userAttending) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;`,
		[
			img_url,
			name_of_event,
			event_host,
			name_of_event_host,
			start_time,
			end_time,
			description,
			cost,
			house_number,
			street_address,
			town,
			region,
			postcode,
			lat,
			long,
			userAttending,
		]
	);
	return data.rows;
};

// UPDATE AN EVENT BY ID (PATCH)
export const updateEvent = async (updatedEvent, id) => {
	const {
		img_url,
		name_of_event,
		event_host,
		name_of_event_host,
		start_time,
		end_time,
		description,
		cost,
		house_number,
		street_address,
		town,
		region,
		postcode,
		lat,
		long,
		userAttending,
	} = updatedEvent;
	const eventUpdate = await query(
		`SELECT * FROM events WHERE events_id = ${id}`
	);
	if (name_of_event) {
		await query(
			`UPDATE events SET name_of_event = $1 WHERE events_id = ${id};`,
			[name_of_event]
		);
	}
	if (name_of_event_host) {
		await query(
			`UPDATE events SET name_of_event_host = $1 WHERE events_id = ${id};`,
			[name_of_event_host]
		);
	}

	if (img_url) {
		await query(`UPDATE events SET img_url = $1 WHERE events_id = ${id};`, [
			img_url,
		]);
	}
	if (start_time) {
		await query(`UPDATE events SET start_time = $1 WHERE events_id = ${id};`, [
			start_time,
		]);
	}
	if (end_time) {
		await query(`UPDATE events SET end_time = $1 WHERE events_id = ${id};`, [
			end_time,
		]);
	}
	if (description) {
		await query(`UPDATE events SET description = $1 WHERE events_id = ${id};`, [
			description,
		]);
	}
	if (cost) {
		await query(`UPDATE events SET cost = $1 WHERE events_id = ${id};`, [cost]);
	}
	if (house_number) {
		await query(
			`UPDATE events SET house_number = $1 WHERE events_id = ${id};`,
			[house_number]
		);
	}
	if (street_address) {
		await query(
			`UPDATE events SET street_address = $1 WHERE events_id = ${id};`,
			[street_address]
		);
	}
	if (town) {
		await query(`UPDATE events SET town = $1 WHERE events_id = ${id};`, [town]);
	}
	if (region) {
		await query(`UPDATE events SET region = $1 WHERE events_id = ${id};`, [
			region,
		]);
	}
	if (postcode) {
		await query(`UPDATE events SET postcode = $1 WHERE events_id = ${id};`, [
			postcode,
		]);
	}
	if (lat) {
		await query(`UPDATE events SET lat = $1 WHERE events_id = ${id};`, [lat]);
	}
	if (long) {
		await query(`UPDATE events SET long = $1 WHERE events_id = ${id};`, [long]);
	}
	// if ( userAttending) {
	//     await query (`UPDATE events SET userAttending = $1 WHERE events_id = ${id};`,
	//     [userAttending] )
	// }
	if (eventUpdate) {
		return eventUpdate.rows;
	}
};

//Search by event ID (GET)
export const getEventById = async (id) => {
	const data = await query(`SELECT * FROM events WHERE events_id = $1;`, [id]);
	return data.rows;
};

//Delete an event by id (DELETE)
export async function deleteEvent(id) {
	const data = await query(
		`DELETE FROM events WHERE events_id = $1 RETURNING *`,
		[Number(id)]
	);
	return data.rows;
}

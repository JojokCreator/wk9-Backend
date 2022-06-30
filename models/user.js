import { query } from "../db/index.js";
import bcrypt from "bcrypt";




//Selects all users from the users table (GET)
export const getUsers = async () => {
  const data = await query(`SELECT * FROM users;`);
  return data.rows;
};

//Creates a new user in the users table(POST)
export const createUser = async (newUser) => {
  //destructured
  const {
    first_name,
    last_name,
    email,
    password,
    house_number,
    street_address,
    town,
    region,
    postcode,
  } = newUser;
  const emailCheck = await query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (emailCheck.rows.length === 0) {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      const data = await query(
        `INSERT INTO users (first_name, last_name , email , password , house_number, street_address, town, region, postcode ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING *;`,
        [
          first_name,
          last_name,
          email,
          hash,
          house_number,
          street_address,
          town,
          region,
          postcode,
        ]
      );
      //console.log(data.rows);
      return data.rows;
    } else {
      console.log("Email Exists");
    } //To Do!!
  } else {
    console.log("Password is blank");
  } //To Do!!
};
//Update user details (PATCH)
// UPDATE A USER BY ID
export const updateUser = async (updatedUser, id) => {
  const {
    first_name,
    last_name,
    email,
    password,
    house_number,
    street_address,
    town,
    region,
    postcode,
  } = updatedUser;
  const userUpdate = await query(`SELECT * FROM users WHERE user_id = ${id}`);
  if (first_name) {
    await query(`UPDATE users SET first_name = $1 WHERE user_id = ${id};`, [
      first_name,
    ]);
  }
  if (last_name) {
    await query(`UPDATE users SET last_name = $1 WHERE user_id = ${id};`, [
      last_name,
    ]);
  }
  if (email) {
    const emailCheck = await query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]); //Checks for duplicate email needs testing
    if (emailCheck.rows.length === 0) {
      await query(`UPDATE users SET email = $1 WHERE user_id = ${id};`, [
        email,
      ]);
    }
  }
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    await query(`UPDATE users SET password = $1 WHERE user_id = ${id};`, [
      hash,
    ]);
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
  if (userUpdate) {
    return userUpdate.rows;
  }
};
//^^Doesn't return the changes of the new user (Check the browser version or the database)

//Search by user ID (GET)
export const getUserById = async (id) => {
	const data = await query(`SELECT * FROM users WHERE user_id = $1;`, [id]);
	return data.rows;
  };

//Delete user from the users table
export const deleteUser = async (id) => {
  const data = await query(
    `DELETE FROM users WHERE user_id = $1 RETURNING *;`,
    [Number(id)]
  );
};

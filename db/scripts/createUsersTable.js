import { query } from "../index.js";

const sqlString = `CREATE TABLE IF NOT EXISTS users(
    user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    first_name VARCHAR, 
    last_name VARCHAR, 
    email VARCHAR, 
    password VARCHAR,
    house_number VARCHAR, 
    street_address VARCHAR, 
    town VARCHAR, 
    region VARCHAR, 
    postcode VARCHAR
    );`;

export async function createUsersTable() {
  const res = await query(sqlString);
  console.log(res.command);
}
createUsersTable();

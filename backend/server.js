const express = require("express"); //for api call
const { Pool } = require("pg"); // to access postgresql DB
const cors = require("cors"); //to give access to front end(cross origin resourse sharing)

const app = express();
app.use(cors());
const PORT = 5000;

//PostgreSQL configuration
const pool = new Pool({
  user: "dp", //username of db
  host: "localhost", //host address
  database: "dpdatabase", //database name
  password: "dp143sss", //user password
  port: 5432, //port number for postgresql
});

//creating api endponit
app.get("/data", async (req, res) => {
  try {
    const client = await pool.connect(); //connect to database
    const result = await client.query("SELECT * FROM sample_data"); //making query to get data
    client.release(); //connecion stopped.
    res.json(result.rows); //returning data
  } catch (err) {
    console.error("Error executing query", err); //printing error
    res.status(500).json({ error: "Internal Server Error" }); //returning error status
    console.log("in error");
  }
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

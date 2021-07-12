const express = require("express");
const mysql = require("mysql");
const cors = require("cors")

const app = express();
const port = process.env.PORT || 5000;

/* Avoid cross origin error */
app.use(
  cors({
    origin: "*"
  })
)

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); // New

// parse application/json
app.use(express.json());

app.use(express.raw());

// MySQL
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "testtask",
});

// Get data
app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      "SELECT product_id, view_count, last_purchased_date FROM wp_wc_product_meta_lookup",
      (err, rows) => {
        connection.release(); // return the connection to pool

        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
          res.sendStatus(500);
          return;
        }
      }
    );
  });
});


/* Update a view count */
app.put('', (req, res) => {

  pool.getConnection((err, connection) => {
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log(`connected as id ${connection.threadId}`)

      const { product_id, view_count, last_purchased_date } = req.body;

      connection.query('UPDATE wp_wc_product_meta_lookup SET view_count = ? WHERE product_id = ?', [view_count, product_id] , (err, rows) => {
          connection.release() // return the connection to pool

          if(!err) {
              res.send(`Update was succesfull for product: ${product_id}.`)
          } else {
            console.log(err);
            res.sendStatus(500);
            return;
          }

      })
  })
})

// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`));

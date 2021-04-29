const express = require('express');
const db = require('./db/connection');

// Add near the top of the file
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

const inputCheck = require('./utils/inputCheck');

// --------------------------- Express middleware  --------------------------- //
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Add after Express middleware
app.use('/api', apiRoutes);




// ----------------------------------- Catchall Route -----------------------------------// 

// Default response for any other request (Not Found) *catchall route* must be last
app.use((req, res) => {
    res.status(404).end();
});



// -----------------------------------  Listen Port -----------------------------------// 
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
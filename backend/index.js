const express = require('express')
require("./db")
const authRoutes=require('./routes/auth')
const notesRoutes=require('./routes/notes')
require('dotenv').config();
var cors = require('cors')
const app = express()
app.use(cors())
const port = process.env.PORT || 5000
app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).json({
      message: 'server running perfectly'
  })
})
app.use('/api/auth',authRoutes);
app.use('/api/notes',notesRoutes)
//This is a.
app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})
//https://i-note-book.herokuapp.com/
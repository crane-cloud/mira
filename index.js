const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.listen(PORT, console.log(`listening on PORT ${PORT}`));
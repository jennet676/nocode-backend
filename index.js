const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

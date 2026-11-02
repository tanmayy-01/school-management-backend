const express = require('express');
const { ServerConfig, Logger } = require('./config');
const apiroutes = require('./routes');
const serverConfig = require('./config/server-config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for frontend integration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/api', apiroutes);

app.listen(serverConfig.PORT, () => {
    console.log(`Successfully started the server on port : ${serverConfig.PORT}`);
    // Logger.info("Successfully started the server");
});

const app = require('express')();
const config = require('./config/config');
const port = config.port;

require('./config/database')(config);
require('./config/middlewares')(app);
require('./config/routes')(app);

app.listen(port, () => {
    console.log(`Server ready and listening on port ${port}...`);
});

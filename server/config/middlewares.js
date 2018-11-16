const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use((req, res, next) => {
        if (req.user) {
            res.locals.user = req.user;
        }

        next();
    });
};
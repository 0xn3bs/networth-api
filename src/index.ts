import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';


// Start the server
const port = Number(process.env.PORT || 3000);

const compression = require('compression');
const helmet = require('helmet');

app.use(compression());
app.use(helmet());

app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

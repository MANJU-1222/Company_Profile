import path from 'path';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const { NODE_ENV,
    PORT} = process.env;

export default {
    NODE_ENV,
    PORT
};

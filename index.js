require('dotenv').config()
const express = require('express')
const app = express()
const connectString = require('./ConnectDb/ConnectString')
const route = require('./Routes/handler')
const authRouter = require('./Routes/authHandler');
const cors = require('cors')


const port = process.env.port || 4000;

app.use(cors());
app.use(express.json());

app.use('/', route)
app.use('/', authRouter);



app.use('/user', route);
app.use('/auth', authRouter);

app.listen(port, () => {
	connectString();
	console.log(`server started on  ${port}`);
});

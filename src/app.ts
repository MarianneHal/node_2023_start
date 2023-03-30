import express, {NextFunction, Response, Request, Application} from 'express';
import {config} from "dotenv";
import * as mongoose from "mongoose";
import fileUploader from "express-fileupload";
import {Server, Socket} from "socket.io";
import * as http from "http"

config();

import {userRouter} from "./routers/user.router";
import {IError} from "./types";
import {authRouter} from "./routers/auth.router";
import {cronRunner} from "./crons";
import {configs} from "./configs/configs";



const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: "*"
    }
});

io.on('connection', (socket:Socket)=>{
    socket.emit('message', {message:'hello'})
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(fileUploader())

app.use('/users', userRouter)
app.use('/auth', authRouter)

app.use((err:IError, req: Request, res:Response, next: NextFunction) => {
    const status = err.status;

    res.status(status).json({
        message: err.message,
        status
    })
});


server.listen(configs.PORT, () => {
    mongoose.connect('mongodb+srv://marianne30011999:hrMYYOvSyTAgi4PR@sept-2022.2ipnwag.mongodb.net/?retryWrites=true&w=majority')
    cronRunner()
    console.log(`Server has started on PORT ${process.env.PORT} 🚀🚀🚀`);
});
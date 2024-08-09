import app from "./app";
import logger from "./util/logger";
import * as socketio from "socket.io";

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    logger.info("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
    logger.info("  Press CTRL-C to stop");
});


process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

let connections: any = [];

server.on("connection", (connection) => {
    connections.push(connection);
    connection.on("close", () => (connections = connections.filter((curr: any) => curr !== connection)));
});

const io = new socketio.Server(server);
//Whenever someone connects this gets executed
io.on("connection", function (socket) {
    console.log("a user connected");

    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", function () {
        console.log("a user disconnected");
    });
});

/**
 * Shutdown express server gracefully.
 */
function shutDown() {
    logger.info("Received kill signal, shutting down gracefully");
    server.close(() => {
        logger.info("Closed out remaining connections");
        process.exit(0);
    });

    setTimeout(() => {
        logger.info("Could not close connections in time, forcefully shutting down");
        process.exit(1);  
    }, 10000);

    connections.forEach((curr: any) => curr.end());
    setTimeout(() => connections.forEach((curr: any) => curr.destroy()), 5000);
}

export default server;

"use strict";
/**
 * Module dependencies.
 */
const { Server } = require("socket.io");

/**
 * Load environment variables from .env file.
 */
const clientURLLocalhost = "http://localhost:5173";
const clientUrlDeploy = "https://proyecto-integrador-chi-ochre.vercel.app";

const port = 8080;

/**
 * Create a WebSocket server using Socket.IO.
 * Configured with CORS policy to allow connections from specified origins.
 */
const io = new Server({
    cors: {
        origin: [clientURLLocalhost, clientUrlDeploy],
        methods: ["GET", "POST"], // Explicitly specify allowed methods
        allowedHeaders: ["my-custom-header"], // Specify allowed headers if needed
        credentials: true // Allow cookies to be sent if needed
    },
});

/**
 * Start listening on the specified port.
 */
io.listen(port);

/**
 * Listen for incoming connections.
 */
io.on("connection", (socket) => {
    /**
     * Log the ID of the player connected.
     */
    console.log(
        "Player joined with ID",
        socket.id,
        ". There are " + io.engine.clientsCount + " players connected."
    );

    /**
     * Handle a player's movement.
     * Broadcast the transforms to other players.
     */
    socket.on("player-moving", (transforms) => {
        //console.log('Player is moving', transforms);
        socket.broadcast.emit("player-moving", {...transforms, playerId: socket.id});
    });

    socket.on("ball-moving", (transforms) => {
        socket.broadcast.emit("ball-moving", {...transforms, playerId: socket.id});
    });

    /**
     * Handle player disconnection.
     */
    socket.on("disconnect", () => {
        console.log(
            "Player disconnected with ID",
            socket.id,
            ". There are " + io.engine.clientsCount + " players connected"
        );
    });
});

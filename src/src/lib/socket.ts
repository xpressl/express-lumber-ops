import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

const globalForSocket = globalThis as unknown as {
  io: SocketIOServer | undefined;
};

export function getSocketServer(httpServer?: HTTPServer): SocketIOServer {
  if (globalForSocket.io) return globalForSocket.io;

  if (!httpServer) {
    throw new Error("Socket.io server requires an HTTP server on first initialization");
  }

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  // Namespace definitions for operational rooms
  // Rooms are joined dynamically: dispatch:{locationId}, route:{routeId}, etc.
  io.on("connection", (socket) => {
    // Join user-specific notification room
    const userId = socket.handshake.auth["userId"] as string | undefined;
    if (userId) {
      void socket.join(`notifications:${userId}`);
    }

    // Join location-based rooms on request
    socket.on("join:location", (locationId: string) => {
      void socket.join(`dispatch:${locationId}`);
      void socket.join(`yard:${locationId}`);
      void socket.join(`pickup:${locationId}`);
      void socket.join(`command-center:${locationId}`);
    });

    socket.on("join:route", (routeId: string) => {
      void socket.join(`route:${routeId}`);
    });

    socket.on("leave:route", (routeId: string) => {
      void socket.leave(`route:${routeId}`);
    });
  });

  if (process.env.NODE_ENV !== "production") {
    globalForSocket.io = io;
  }

  return io;
}

// Helper to emit to specific rooms from server-side code
export function emitToRoom(room: string, event: string, data: unknown): void {
  if (globalForSocket.io) {
    globalForSocket.io.to(room).emit(event, data);
  }
}

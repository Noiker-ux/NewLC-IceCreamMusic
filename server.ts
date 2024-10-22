// import { createServer } from "http";
// import { parse } from "url";
// import next from "next";
import { startCronTasks, stopCronTasks } from "./config/cron";

// const port = parseInt(process.env.PORT || "3000", 10);
// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   createServer((req, res) => {
//     const parsedUrl = parse(req.url!, true);
//     handle(req, res, parsedUrl);
//   })
//     .listen(port)
//     .on("close", () => {
//       console.log("Server closed");
//       stopCronTasks();
//     })
//     .on("listening", () => {
//       startCronTasks();
//       console.log(
//         `> Server listening at http://localhost:${port} as ${
//           dev ? "development" : process.env.NODE_ENV
//         }`
//       );
//     });
// });

function bootstrap() {
  startCronTasks();

  // process.on("exit", () => {
  //   stopCronTasks();
  // });
}

bootstrap();

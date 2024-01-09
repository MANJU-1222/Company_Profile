import app from "./app";

import config from './config/env.config';

process.on("uncaughtException", (err : Error) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHTEXCEPTION --SHUTTING DOWN--");
  process.exit(1);
});

let port:number = config.PORT ? +config.PORT : 6017;
console.log("NODE_ENV : ",config.NODE_ENV);

if (config.NODE_ENV == "development") {
  console.log("In development");
  port = parseInt(config.PORT || '3000', 10);
} else if (config.NODE_ENV == "production") {
  console.log("In production");
}

// app.use((err, ))

const server = app.listen({ port }, async () => {
  console.log("Server started in http://localhost:", port);
  // await sequelize.sync({force:true});
  // await sequelize.authenticate();
  // console.log("Database Connected");
});

process.on("unhandledRejection", (err : Error) => {
  console.log(err.name, err.message);
  console.log("UNHANDLEDREJECTION --SHUTTING DOWN--");
  //instent of using process.exit(1); directly
  server.close(() => {
    //It will reject all the responce and then exit.
    process.exit(1);
  });
});

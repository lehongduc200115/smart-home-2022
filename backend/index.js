"use strict";

const Hapi = require("@hapi/hapi");

const init = async () => {
  const mongoose = require("mongoose");

  mongoose
    .connect(
      // "mongodb+srv://swat-js:G28Pyl2eTGVVaYmWv3O2Medf@swat-js-dev.fwbu9.mongodb.net/le-rule-engine?retryWrites=true&w=majority",
      "mongodb+srv://lehongduc200115:totran0302@smarthome2022cluster.jykyl.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("MongoDB connected...."))
    .catch((err) => console.log(err));
  //Define Schema

  let requestSchema = {
    requestType: String,
    requestStatus: String,
    status: String,
    createdAt: Date,
    createdBy: String
  };
  let lightSchema = {
    value: String,
    status: String,
    createdAt: Date,
  };
  let tempSchema = {
    value: String,
    status: String,
    createdAt: Date,
  };

  //Create Model
  const Request = mongoose.model("Requests", requestSchema);
  const Light = mongoose.model("Lights", lightSchema);
  const Temp = mongoose.model("Temps", tempSchema);

  const server = Hapi.server({
    port: 8080,
    host: "localhost",

    routes: {
      cors: true,
    },
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello World!";
    },
  });

  server.route({
    method: "POST",
    path: "/api/request",
    handler: async (request, h) => {
      let info = request.payload;
      info.createdAt = new Date();
      info.createdBy = info.createdBy | 'Admin'
      console.log(info);
      let newRequest = new Request(info);
      await newRequest.save((err, task) => {
        if (err) return console.log(err);
      });
      return h.response("Success");
    },
  });
  server.route({
    method: "POST",
    path: "/api/light",
    handler: async (request, h) => {
      let info = request.payload;
      info.createdAt = new Date();
      console.log(info);
      let newRequest = new Light(info);
      await newRequest.save((err, task) => {
        if (err) return console.log(err);
      });
      return h.response("Success");
    },
  });
  server.route({
    method: "POST",
    path: "/api/temp",
    handler: async (request, h) => {
      let info = request.payload;
      info.createdAt = new Date();
      console.log(info);
      let newRequest = new Temp(info);
      await newRequest.save((err, task) => {
        if (err) return console.log(err);
      });
      return h.response("Success");
    },
  });
  server.route({
    method: "GET",
    path: "/api/requests",
    handler: async (request, h) => {
      let params = request.query;
      let infos = await Request.find(params).lean();
      return h.response(infos);
    },
  });
  server.route({
    method: "GET",
    path: "/api/lights",
    handler: async (request, h) => {
      let params = request.query;
      params.sort = { createdAt: -1 }
      let infos = await Light.find(params).lean();
      return h.response(infos);
    },
  });
  server.route({
    method: "GET",
    path: "/api/temps",
    handler: async (request, h) => {
      let params = request.query;
      params.sort = { createdAt: -1 }
      let infos = await Temp.find(params).lean();
      return h.response(infos);
    },
  });
  server.route({
    method: "PUT",
    path: "/api/request/{id}",
    handler: async (request, h) => {
      let params = request.params.id;
      let info = request.payload;
      let infos = await Note.updateOne({ _id: params }, info).lean();
      return h.response(infos);
    },
  });
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();

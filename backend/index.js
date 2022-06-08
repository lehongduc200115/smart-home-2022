"use strict";

const Hapi = require("@hapi/hapi");

const init = async () => {
  require("dotenv").config();
  const mongoose = require("mongoose");

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected...."))
    .catch((err) => console.log(err));
  //Define Schema

  let requestSchema = {
    requestType: String,
    requestStatus: String,
    status: String,
    createdAt: Date,
    createdBy: String,
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
  let thresholdSchema = {
    value: String,
    status: String,
    type: String,
    createdAt: Date,
  };

  //Create Model
  const Request = mongoose.model("Requests", requestSchema);
  const Light = mongoose.model("Lights", lightSchema);
  const Temp = mongoose.model("Temps", tempSchema);
  const Threshold = mongoose.model("Thresholds", thresholdSchema);

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
      info.createdBy = info.createdBy | "Admin";
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
    path: "/api/threshold",
    handler: async (request, h) => {
      let info = request.payload;
      info.createdAt = new Date();
      console.log(info);
      let newRequest = new Threshold(info);
      await Threshold.findOneAndUpdate(
        {
          type: request.type,
        },
        newRequest,
        { new: true },
        (err, updatedThreshold) => {
          if (err) return h.response("Error while saving");
          if (!updatedThreshold) {
            newRequest.save((err) => {
              if (err) return console.log(err);
            });
          }
          return h.response("Success2");
        }
      );
      return h.response("Success");
    },
  });
  server.route({
    method: "GET",
    path: "/api/thresholds/{type}",
    handler: async (request, h) => {
      let params = request.params;
      let infos = await Threshold.find(params)
        .sort({ createdAt: -1 })
        .limit(1)
        .lean();
      return h.response(infos);
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
      let infos = await Light.find(params).sort({ createdAt: -1 }).lean();
      return h.response(infos);
    },
  });
  server.route({
    method: "GET",
    path: "/api/temps",
    handler: async (request, h) => {
      let params = request.query;
      let infos = await Temp.find(params).sort({ createdAt: -1 }).lean();
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

"use strict";

const Hapi = require("@hapi/hapi");


//helper
function findDate(date, findAfter = false) {
  let ret = new Date(date)
  ret.setHours(0);
  ret.setMinutes(0);
  if (findAfter)
    ret.setDate(ret.getDate()+1)
  return ret;
}

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
  let bulbSchema = {
    stt: Number,
    floor: Number,
    power: Number,
  };

  //Create Model
  const Request = mongoose.model("Requests", requestSchema);
  const Light = mongoose.model("Lights", lightSchema);
  const Temp = mongoose.model("Temps", tempSchema);
  const Threshold = mongoose.model("Thresholds", thresholdSchema);
  const Bulb = mongoose.model("Bulbs", bulbSchema);

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
    method: "GET",
    path: "/api/bulbs",
    handler: async (request, h) => {
      let params = request.params;
      let infos = await Bulb.find(params).sort({ stt: 1 }).lean();
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
    method: "GET",
    path: "/api/temps/power",
    handler: async (request, h) => {
      let nowDate = new Date();
      let curDate = [findDate(nowDate, true)];
      for (let i = 0; i < 6; i++) {
        curDate.push(findDate(new Date(curDate[i] - 360000)));
      }
      let params = request.query;
      const infos = [0, 0, 0, 0, 0, 0, 0];
      const count = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 7; i++) {
        params.createdAt = {
          $gte: curDate[i + 1],
          $lte: curDate[i],
        };
        let res = await Temp.find(params).lean();
        count[i] = res ? res.length : 0;
        for (let j = 0; j < res.length; j++) {
          infos[i] += parseInt(res[j].value);
        }
      }
      for (let i = 0; i < 7; i++) {
        infos[i] = count[i] ? infos[i] / count[i] : 0;
        infos[i] = infos[i].toFixed(2);
      }
      return h.response(infos);
    },
  });
  server.route({
    method: "GET",
    path: "/api/bulbs/power",
    handler: async (request, h) => {
      let date = new Date();
      let curDate = findDate(date, true)
      let curDate_1 = findDate(date);
      let params = request.query;
      let bulbsParams = request.query;
      const infos = [0, 0, 0, 0, 0, 0];
      for (let i = 1; i < 5; i++) {
        params.createdAt = {
          $gte: curDate_1,
          $lte: curDate,
        };
        params.requestType = /^LIGHT/i;
        bulbsParams.floor = i;
        let bulbs = await Bulb.find(bulbsParams).lean();
        for (let j = 0; j < bulbs.length; j++) {
          params.stt = bulbs[j].stt;
          let reqs = await Request.find(params).sort({ createdAt: 1 }).lean();
          console.log(`reqs: ${JSON.stringify(reqs)}`);
          let totalTurnOn = 0;
          for (let k = 1; k < reqs.length - 1; k++) {
            if (
              reqs[k].requestType === "LIGHT_ON" &&
              reqs[k + 1].requestType === "LIGHT_OFF"
            )
              totalTurnOn +=
                (reqs[k + 1].createdAt - reqs[k].createdAt) / 3600000;
          }
          if (reqs.length && reqs[reqs.length - 1].requestType === "LIGHT_ON") {
            let createdAt = reqs[reqs.length - 1].createdAt;
            console.log(`totalTurnOn pre: ${totalTurnOn}`)
            totalTurnOn +=
              (findDate(createdAt, true) -
                createdAt) /
              3600000;
            console.log(`totalTurnOn after: ${totalTurnOn}`)
          }
          if (reqs.length && reqs[0].requestType === "LIGHT_OFF") {
            let createdAt = reqs[0].createdAt;
            totalTurnOn +=
              (createdAt - findDate(createdAt)) / 3600000;
          }
          console.log(`totalTurnOn: ${totalTurnOn}`);
          console.log(`power: ${bulbs[j].power}`);
          infos[bulbs[j].floor] += totalTurnOn * bulbs[j].power;
        }
      }
      for (let i = 0; i < 6; i++) {
        infos[i] = infos[i].toFixed(2);
      }
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const functions = require("firebase-functions");
// const Telegraf = require('telegraf');
// import functions from "firebase-functions";
import {Telegraf} from "telegraf";

console.log(functions.config(), "functions.config");

const bot = new Telegraf(functions.config().telegram.token, {
  telegram: {webhookReply: true},
});

// error handling
// bot.catch((err: any, ctx: any) => {
//   functions.logger.error("[Bot] Error", err);
//   return ctx.reply(`Oh no, encountered an error for ${ctx.updateType}`, err);
// });

// initialize the commands
bot.command("start", (ctx: any) =>
  ctx.reply("Hello! Send any message and I will copy it.")
);
// copy every message and send to the user
bot.on("message", (ctx: any) =>
  ctx.telegram.sendMessage(ctx.chat.id, ctx.message.text)
);

// exports.bot = functions.https.onRequest(bot.webhookCallback("/secret-path"));

// handle all telegram updates with HTTPs trigger
exports.officialCollieBot = functions
  .region("australia-southeast1")
  .https.onRequest(async (request: any, response: any) => {
    functions.logger.log("Incoming message", request.body);

    // console.log(request, 'request');
    // console.log(response, 'response');

    if (request.path === "/health") {
      return response.status(200).send("OK");
    }

    await bot.handleUpdate(request.body, response);
    // try {
    //   const rv = await bot.handleUpdate(request.body, response);
    //   // If rv is undefined, it means bot.handleUpdate did not send response
    //   if (rv === undefined) {
    //     response.sendStatus(200);
    //   }
    // } catch (error) {
    //   functions.logger.error("Error handling update", error);
    //   response.sendStatus(500);
    // }
    // return await bot.handleUpdate(request.body, response).then((rv: any) => {
    //   // if it's not a request from the telegram, rv will be undefined,
    //   // but we should respond with 200
    //   return !rv && response.sendStatus(200);
    // });
  });

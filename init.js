'use strict';

const bot = require('./bot.js');
const utility = require('./utility.js');

const battler = require('./battler/ABattler.js');

bot.on("message", function (message) {
  // ChatWnd: channel
  // Origin: sender.name
  // Message: message.content
  // MsgKind: unused
  battler.OnEvent_ChatWndReceiveMessage(message.channel, message.sender.name, message.content);
  battler.OnEvent_ChatWndSendMessage(message.channel, message.content);
}
//utility.registerCommand(name, command.fn); // register

/*
exports.OnEvent_ChatWndReceiveMessage = OnEvent_ChatWndReceiveMessage;
exports.OnEvent_ChatWndSendMessage = OnEvent_ChatWndSendMessage;
exports.OnEvent_MenuClicked = OnEvent_MenuClicked;
exports.OnEvent_Initialize = OnEvent_Initialize;
exports.OnEvent_Uninitialize = OnEvent_Uninitialize;
exports.OnWndEditMonEvent_CtrlClicked = OnWndEditMonEvent_CtrlClicked;
*/
// From http://baagoe.com/en/RandomMusings/javascript/
// Johannes Baagøe <baagoe@baagoe.com>, 2010

/*jslint bitwise: true */

'use strict';
function Alea() {
  return (function (args) {
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if (args.length === 0) {
      args = [+new Date()];
    }
    var mash = Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;

    var random = function () {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
    random.uint32 = function () {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function () {
      return random() +
        (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    return random;

  }(Array.prototype.slice.call(arguments)));
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function (data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  mash.version = 'Mash 0.9';
  return mash;
}

//Battler - Battles with MSN, inspired by Pokemon.
//Created by Apotah, <apotah@hotmail.com>.
//Version 5.02, <2012 October 22>.
// http://apotah.zxq.net/battler/

function OnEvent_ChatWndReceiveMessage(ChatWnd, Origin, Message, MsgKind) { // TODO - Missing polyfill

  if (obConf.Pref.enabled === false) {
    return;
  }

  Message = Message.toLowerCase();

  //determine which chat window is being used for the battle; diff chat wnds = diff battles
  for (i = 0; i <= bWnd.length + 1; i++) {
    //if there's a battle in the window that just received a msg, iWnd = that battle's pos. in bWnd
    if (bWnd[i] !== undefined && bWnd[i].Wnd === ChatWnd) {
      iWnd = i;
      if (Message.substr(0, 5) === "ichal" || Message.substr(0, obCmds.Fight.length) === obCmds.Fight) {
        sendMsg(obTrans.GetMessages().GetString("IChalFail"));
        return;
      }
      break;
    }
    //if there's no battle, i = the last empty pos. in bWnd
    else if (bWnd[i] === undefined) {
      iWnd = i;
      //check if the sender actually wanted to start a battle
      if (Message.substr(0, 5) === "ichal" || Message.substr(0, obCmds.Fight.length) === obCmds.Fight) {
        bWnd[iWnd] = {
          "Wnd": ChatWnd,
          "Turn": 0,
          "Return": 0,
          Player: [null, {
            "Name": Origin
          }, {}]
        };
        sendMsg(obTrans.GetMessages().GetString("IChalSuccess").replace(/PLAYER_NAME/g, Origin));
      }
      return;
    }
  }

  if (Message === "bhelp" || Message === obCmds.Help) {
    sendMsg(obTrans.GetMessages().GetString("BHelp").replace(/SCRIPT_VERSION/g, obConf.Version.current));
  } else if ((Message === "qq" || Message === obCmds.Quit) && (bWnd[iWnd].Player[1].Name === Origin || bWnd[iWnd].Player[2].Name === Origin)) {
    if (obConf.Pref.quitOn === false) {
      sendMsg(obTrans.GetMessages().GetString("QuitDisabled"));
    } else {
      sendMsg(obTrans.GetMessages().GetString("Quit").replace(/PLAYER_NAME/g, Origin));
      bWnd.splice(iWnd, 1);
      if (Origin === Messenger.MyName) {
        settings.UpdateRecord("quit");
      }
    }
  } else if ((Message.substr(0, 2) === "go" && Message.substr(0, obCmds.Go.length) !== obCmds.Go) || Message.substr(0, obCmds.Go.length) === obCmds.Go) {

    var extractStrFrom = 3;
    var isCustomMon = false;
    if (Message.substr(0, obCmds.Go.length) === obCmds.Go) {
      extractStrFrom = obCmds.Go.length + 1;
      if (Message.charAt(obCmds.Go.length) === "!") {
        extractStrFrom += 1;
        isCustomMon = true;
      }
    } else if (Message.charAt(2) === "!") {
      extractStrFrom = 4;
      isCustomMon = true;
    }
    strName = Message.substr(extractStrFrom);
    // Debug.Trace(strName);

    if (obConf.Pref.mustBePokemonOn === true && PokemonTypes(strName.toUpperCase()) === -1) {
      //MustBePokemon overrides AllowCustomMons
      sendMsg(obTrans.GetMessages().GetString("GoMustBePokemon"));
    } else {
      if (bWnd[iWnd].Player[1].Name !== Origin && bWnd[iWnd].Player[2].Name === undefined) {
        bWnd[iWnd].Player[2].Name = Origin;
      }
      for (i = 1; i <= 2; i++) {
        if (bWnd[iWnd].Player[i].Mon !== undefined && bWnd[iWnd].Player[i].Name === Origin) {
          sendMsg(obTrans.GetMessages().GetString("GoAlreadySent").replace(/PLAYER_NAME/, Origin).replace(/MON_NAME/, bWnd[iWnd].Player[i].Mon.Name));
          break;
        } else if (bWnd[iWnd].Player[i].Name === Origin && bWnd[iWnd].Player[i].Mon === undefined) {
          if (isCustomMon === true) {
            if (obConf.Pref.customGoOn === true) {
              if (obMonParty[strName] !== undefined) {
                if (obMonParty[strName].Enabled === true) {
                  bWnd[iWnd].Player[i].Mon = new LoadMon(obMonParty[strName]);
                } else if (obMonParty[strName].Enabled === false) {
                  sendMsg(obTrans.GetMessages().GetString("GoCustomMonDisabled"));
                  return;
                }
              } else {
                sendMsg(obTrans.GetMessages().GetString("GoCustomMonNotExist"));
                return;
              }
            } else {
              sendMsg(obTrans.GetMessages().GetString("GoCustomDisabled"));
              return;
            }
          } else {
            bWnd[iWnd].Player[i].Mon = new CreateMon(strName);
          }
          Player = bWnd[iWnd].Player[i];
          sendMsg(obTrans.GetMessages().GetString("GoSuccess").replace(/PLAYER_NAME/, Player.Name).replace(/MON_NAME/, Player.Mon.Name) + " " + Player.Mon.HPCur + " HP, " + Player.Mon.Atk + " ATK, " + Player.Mon.Def + " DEF, " + Player.Mon.Spe + " SPE, " + Player.Mon.Spc + " SPC. " + obTrans.GetMessages().GetString("Type") + ": " + displayType(Player.Mon.Type) + ".");
          if (bWnd[iWnd].Return === 0 && ((i === 2 && bWnd[iWnd].Player[1].Mon !== undefined) || (i === 1 && bWnd[iWnd].Player[2].Mon !== undefined))) {
            bWnd[iWnd].Turn = (bWnd[iWnd].Player[1].Mon.Spe >= bWnd[iWnd].Player[2].Mon.Spe) ? 1 : 2;
            sendMsg(obTrans.GetMessages().GetString("GoIsFirst").replace(/MON_NAME/, bWnd[iWnd].Player[bWnd[iWnd].Turn].Mon.Name));
          }
          break;
        }
      }
    }
  } else if (Message.substr(0, 6) === "return" || Message.substr(0, obCmds.Return.length) === obCmds.Return) {
    if (obConf.Pref.returnOn === false) {
      sendMsg(obTrans.GetMessages().GetString("ReturnDisabled"));
    } else {
      for (i = 1; i <= 2; i++) {
        if (bWnd[iWnd].Player[i].Name === Origin && bWnd[iWnd].Turn === i) {
          sendMsg(obTrans.GetMessages().GetString("Return").replace(/PLAYER_NAME/, Origin).replace(/MON_NAME/, bWnd[iWnd].Player[i].Mon.Name));
          if (bWnd[iWnd].Player[i === 1 ? 2 : 1].Mon.Status.ID === 6) {
            bWnd[iWnd].Player[i === 1 ? 2 : 1].Mon.Status.ID = -1;
          }
          bWnd[iWnd].Player[i].Mon = undefined;
          bWnd[iWnd].Return = i;
          bWnd[iWnd].Turn = bWnd[iWnd].Turn === 1 ? 2 : 1;
          break;
        } else if (bWnd[iWnd].Player[i].Name === Origin && bWnd[iWnd].Turn !== i) {
          notYourTurn();
        }
      }
    }
  } else if ((Message.substr(0, 3) === "use" && Message.substr(0, obCmds.Attack.length) !== obCmds.Attack) || Message === "heal" || Message.substr(0, obCmds.Attack.length) === obCmds.Attack || Message === obCmds.Heal) {
    if (bWnd[iWnd].Player[bWnd[iWnd].Turn].Name === Origin) {
      var isAttack = true;
      if (Message === "heal" || Message === obCmds.Heal) {
        isAttack = false;
      }
      var offMon = bWnd[iWnd].Player[bWnd[iWnd].Turn].Mon;
      var defMon = bWnd[iWnd].Player[(bWnd[iWnd].Turn === 1 ? 2 : 1)].Mon;
      if (isAttack === true) {
        var atkName = Message.substr(0, 3) === "use" ? Message.substr(4) : Message.substr(obCmds.Attack.length + 1);
        var existsInMoveDB = obMoveDB[atkName] === undefined ? false : true;
        if (obConf.Pref.moveDBOnlyOn === true && existsInMoveDB === false) {
          sendMsg(obTrans.GetMessages().GetString("UseMoveDBOnly"));
        } else {
          attackMon(offMon, defMon, atkName, existsInMoveDB);
        }
      } else {
        healMon(offMon);
      }
    } else {
      notYourTurn();
    }
  } else if ((Message.substr(0, 4) === "item" && Message.substr(0, obCmds.Item.length) !== obCmds.Item) || Message.substr(0, obCmds.Item.length) === obCmds.Item) {
    if (obConf.Pref.itemOn === false) {
      sendMsg(obTrans.GetMessages().GetString("ItemDisabled"));
    } else {
      if (bWnd[iWnd].Player[bWnd[iWnd].Turn].Name === Origin) {
        let itemName = Message.substr(0, 4) === "item" ? Message.substr(5) : Message.substr(obCmds.Item.length + 1);
        if (obItemDB[itemName] !== undefined) {
          if (obItemDB[itemName].Enabled === true) {
            useItem(bWnd[iWnd].Player[bWnd[iWnd].Turn], itemName, obItemDB[itemName].Eff);
          } else if (obItemDB[itemName].Enabled === false) {
            sendMsg(obTrans.GetMessages().GetString("ItemNotAvail"));
          }
        } else {
          sendMsg(obTrans.GetMessages().GetString("ItemNotExist"));
        }
      } else {
        notYourTurn();
      }
    }
  } else if ((Message.substr(0, 5) === "equip" && Message.substr(0, obCmds.Equip.length) !== obCmds.Equip) || Message.substring(0, obCmds.Equip.length) === obCmds.Equip) {
    if (obConf.Pref.equipOn === false) {
      sendMsg(obTrans.GetMessages().GetString("EquipDisabled"));
    } else {
      if (bWnd[iWnd].Player[bWnd[iWnd].Turn].Name === Origin) {
        let itemName = Message.substr(0, 5) === "equip" ? Message.substr(6) : Message.substr(obCmds.Equip.length + 1);
        if (obEquipDB[itemName] !== undefined) {
          if (obEquipDB[itemName].Enabled === true) {
            equipItem(bWnd[iWnd].Player[bWnd[iWnd].Turn].Mon, itemName, obEquipDB[itemName].Eff, obEquipDB[itemName].Text);
          } else {
            sendMsg(obTrans.GetMessages().GetString("ItemNotAvail"));
          }
        } else {
          sendMsg(obTrans.GetMessages().GetString("ItemNotExist"));
        }
      } else {
        notYourTurn();
      }
    }
  } else if (Message === "unequip" || Message === obCmds.Unequip) {
    if (bWnd[iWnd].Player[bWnd[iWnd].Turn].Name === Origin) {
      unequipItem(bWnd[iWnd].Player[bWnd[iWnd].Turn].Mon);
    } else {
      notYourTurn();
    }
  }
}

function OnEvent_ChatWndSendMessage(ChatWnd, sMessage) { // TODO - Missing polyfill
  if (sMessage === "\/battler") {
    obConf.Pref.enabled = obConf.Pref.enabled === true ? false : true;
    return "";
  } else if (sMessage === "\/battlerrecord") {
    var total = (obConf.Record.win + obConf.Record.lose + obConf.Record.quit) / 100;
    if (total === 0) {
      total = 1;
    }
    var sMsg = obTrans.GetMessages().GetString("RecordWins") + ": " + obConf.Record.win + " (" + Math.round(obConf.Record.win / total) + "%) " + obTrans.GetMessages().GetString("RecordLosses") + ": " + obConf.Record.lose + " (" + Math.round(obConf.Record.lose / total) + "%) " + obTrans.GetMessages().GetString("RecordQuits") + ": " + obConf.Record.quit + " (" + Math.round(obConf.Record.quit / total) + "%) ";
    ChatWnd.SendMessage(obConf.Pref.msgFormat[0] + "*" + sMsg + obConf.Pref.msgFormat[1]);
    return "";
  } else if (sMessage === "\/battleritems") {
    loadShopWnd(shopWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndShop"));
    return "";
  } else if (sMessage === "\/battlerequip") {
    loadEquipWnd(equipWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndEquip"));
    return "";
  } else if (sMessage === "\/battlerprefs") {
    loadPrefsWnd(configWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndConfig"));
    return "";
  } else if (sMessage === "\/battlermons") {
    loadMonWnd(monWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndMons"));
    return "";
  } else if (sMessage === "\/battlermoves") {
    loadMoveWnd(moveWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndMoves"));
    return "";
  } else if (sMessage === "\/battlercmds") {
    loadCmdWnd(cmdWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndCommands"));
    return "";
  } else if (sMessage.substring(0, 5) === "\/dmg ") {
    CHEAT = parseInt(sMessage.substr(5), 10);
    return "";
  }
}

function OnGetScriptCommands() {

  var ScriptCommands = "<ScriptCommands>";
  ScriptCommands += "<Command>";
  ScriptCommands += "<Name>battler</Name>";
  ScriptCommands += "<Description>Toggle enabled status</Description>";
  ScriptCommands += "</Command>";
  ScriptCommands += "<Command>";
  ScriptCommands += "<Name>battlerprefs</Name>";
  ScriptCommands += "<Description>Open config window</Description>";
  ScriptCommands += "</Command>";
  ScriptCommands += "<Command>";
  ScriptCommands += "<Name>battleritems</Name>";
  ScriptCommands += "<Description>View items</Description>";
  ScriptCommands += "</Command>";
  ScriptCommands += "<Command>";
  ScriptCommands += "<Name>battlerequip</Name>";
  ScriptCommands += "<Description>View equipment</Description>";
  ScriptCommands += "</Command>";
  ScriptCommands += "<Command>";
  ScriptCommands += "<Name>battlerrecord</Name>";
  ScriptCommands += "<Description>Send Battler wins\/losses\/quits record</Description>";
  ScriptCommands += "</Command>";
  ScriptCommands += "<Command>";
  ScriptCommands += "<Name>dmg</Name>";
  ScriptCommands += "<Description>Change damage of next attack</Description>";
  ScriptCommands += "<Parameters>&lt;number&gt;</Parameters>";
  ScriptCommands += "</Command>";
  ScriptCommands += "<Command>";
  ScriptCommands += "<Name>battlermons</Name>";
  ScriptCommands += "<Description>View custom Mons</Description>";
  ScriptCommands += "</Command>";
  ScriptCommands += "<Command>";
  ScriptCommands += "<Name>battlermoves</Name>";
  ScriptCommands += "<Description>View the moves list</Description>";
  ScriptCommands += "</Command>";
  ScriptCommands += "<Command>";
  ScriptCommands += "<Name>battlercmds</Name>";
  ScriptCommands += "<Description>Edit commands</Description>";
  ScriptCommands += "</Command>";
  // ScriptCommands    +=     "<Command>";
  // ScriptCommands    +=         "<Name>battlerupdate</Name>";
  // ScriptCommands    +=         "<Description>Check for updates for Battler</Description>";
  // ScriptCommands    +=     "</Command>";
  // ScriptCommands    +=     "<Command>";
  // ScriptCommands    +=         "<Name>battlershare</Name>";
  // ScriptCommands    +=         "<Description>Share with your friends</Description>";
  // ScriptCommands    +=     "</Command>";
  ScriptCommands += "</ScriptCommands>";

  return ScriptCommands;

}

function attackMon(offMon, defMon, atkName, existsInMoveDB) {

  var oAtk = {};
  oAtk.Name = atkName;

  if (oAtk.Name === "") {
    oAtk.Name = obTrans.GetMessages().GetString("AtkDefault");
  }

  if (existsInMoveDB === true && obConf.Pref.moveDBOn === true) {
    oAtk.Eff = obMoveDB[oAtk.Name].Eff;
    oAtk.Acc = obMoveDB[oAtk.Name].Acc;
    oAtk.Pwr = obMoveDB[oAtk.Name].Pwr;
    oAtk.Type = obMoveDB[oAtk.Name].Type;
    oAtk.Failed = (oAtk.Acc === -1) ? false : (oAtk.Acc / 100 < rand() ? true : false);
  } else { //for unlisted attacks, effects are randomized
    oAtk.Eff = "u" + occRate(defMon, obConf.OccRate.strip, "Def") * 100;
    oAtk.Eff += "d";
    oAtk.Eff += "s0" + Math.floor(rand() * 7) + occRate(offMon, obConf.OccRate.status, "Spc") * 100;
    var i = Math.floor(rand() * 2);
    oAtk.Eff += "m" + i + Math.floor(rand() * 4) + occRate(offMon, obConf.OccRate.mod, "Spc") * 100 + (i === 0 ? "-" : "+") + 1;
    oAtk.Eff += "f" + occRate(offMon, obConf.OccRate.flinch, "Atk") * 100;
    if (occRate(defMon, obConf.OccRate.recoil, "HPMax") > rand()) {
      oAtk.Eff += "r010";
    }
    oAtk.Acc = occRate(defMon, obConf.OccRate.miss, "Spe") * 100;
    oAtk.Pwr = damageCalc.Power();
    oAtk.Type = offMon.Type[(offMon.Type[1] ? Math.floor(rand() * 2) : 0)];
    oAtk.Failed = oAtk.Acc / 100 > rand() ? true : false;
    //you may think, why divide the rates by 100 if I'm just going to multiply by 100 later
    //it's like that because MoveDB moves are written with integers and I don't want to go back and change 'em all
    //decimals do work though, but only randomly generated moves may have them
  }
  oAtk.Name = oAtk.Name.toUpperCase();
  //Debug.Trace(oAtk.Eff);

  if (status.StartCheck(offMon) === 1) {
    //if attacks do damage, they "miss"; if not, they "fail"
    if (oAtk.Acc > -1 && oAtk.Failed === true && oAtk.Eff.indexOf("d") >= 0) {
      sendMsg(obTrans.GetMessages().GetString("AtkMissed").replace(/MON1_NAME/, defMon.Name).replace(/MON2_NAME/, offMon.Name).replace(/ATTACK_NAME/, oAtk.Name));
    } else if (oAtk.Acc > -1 && oAtk.Failed === true && oAtk.Eff.indexOf("d") < 0) {
      sendMsg(obTrans.GetMessages().GetString("AtkFailed").replace(/MON_NAME/, offMon.Name).replace(/ATTACK_NAME/, oAtk.Name));
    } else {
      a = oAtk.Eff.match(/m.*[\+\-]\d*|d|f[\d\.]*|s[\d\.]*|r[\d\.]*|c[\d\.]*|h[\d\.]*|w/gi);
      for (i = 0; i < a.length; i++) {
        switch (a[i].charAt(0)) {
        case "d": //Damage - Formula based on 4th Gen Games
          if (oAtk.Pwr === undefined) {
            oAtk.Pwr = damageCalc.Power();
          }
          oAtk.Dmg = Math.floor((((0.84 * oAtk.Pwr * (offMon.Atk * statMod.Get(offMon, 0)) * damageCalc.Mod1(offMon) / (defMon.Def * statMod.Get(defMon, 1))) + 2) * damageCalc.Crit(offMon) * (rand() * 39 + 85) / 100) * damageCalc.STAB(offMon.Type, oAtk.Type) * damageCalc.Type(oAtk.Type, defMon.Type) * obConf.Pref.dmgMod);
          if (oAtk.Pwr === -1) {
            oAtk.Dmg = defMon.HPMax;
          } else if (oAtk.Pwr === 0) {
            oAtk.Dmg = 0;
          }
          if (a[i].slice(1) !== "") {
            Debug.Trac
            oAtk.Dmg = parseInt(a[i].substr(1));
          }
          if (isNaN(CHEAT) === false) {
            oAtk.Dmg = CHEAT;
            CHEAT = undefined;
          }
          defMon.HPCur - oAtk.Dmg < 0 ? defMon.HPCur = 0 : defMon.HPCur -= oAtk.Dmg;
          sendMsg(msgCrit + msgEffect + obTrans.GetMessages().GetString("AtkDamage").replace(/MON_NAME/, offMon.Name).replace(/ATTACK_NAME/, oAtk.Name).replace(/NUMBER/, oAtk.Dmg));
          displayHP(defMon);
          break;
        case "m":
          if (parseFloat(a[i].slice(3).match(/^.*[\+\-]/gi)[0].replace(/[\+\-]/gi, "")) / 100 > rand()) {
            statMod.Set.Relative((a[i].charAt(1) === "0" ? defMon : offMon), parseInt(a[i].charAt(2), 10), parseInt(a[i].match(/[\+\-].*/)[0], 10));
          }
          break;
        case "s":
          if (parseFloat(a[i].slice(3)) / 100 > rand()) {
            status.Set(a[i].charAt(1) === "0" ? defMon : offMon, parseInt(a[i].charAt(2), 10));
          }
          break;
        case "h":
          v = a[i].charAt(1) === "0" ? Math.ceil(parseFloat(a[i].slice(2)) / 100 * offMon.HPMax) : Math.ceil(oAtk.Dmg / 2);
          offMon.HPCur + v > offMon.HPMax ? offMon.HPCur = offMon.HPMax : offMon.HPCur += v;
          sendMsg(obTrans.GetMessages().GetString("HealSuccess").replace(/MON_NAME/, offMon.Name).replace(/NUMBER/, v));
          displayHP(offMon);
          break;
        case "c":
          if (parseFloat(a[i].slice(1)) / 100 > rand()) {
            sendMsg(obTrans.GetMessages().GetString("StatusCured").replace(/MON_NAME/, offMon.Name));
          }
          break;
        case "r":
          v = Math.ceil((a[i].charAt(1) === "0" ? oAtk.Dmg : offMon.HPCur) * parseFloat(a[i].slice(2)) / 100);
          offMon.HPCur - v < 0 ? offMon.HPCur = 0 : offMon.HPCur -= v;
          sendMsg(obTrans.GetMessages().GetString("AtkRecoil").replace(/MON_NAME/, offMon.Name).replace(/NUMBER/, v));
          displayHP(offMon);
          break;
        case "w":
          offMon.Status.Recharge = 1;
          break;
        case "f":
          if (parseFloat(a[i].slice(1)) / 100 > rand()) {
            sendMsg(obTrans.GetMessages().GetString("AtkFlinch").replace(/MON_NAME/, defMon.Name));
            changeTurn(bWnd[iWnd].Turn, offMon, defMon);
          }
          break;
        case "u":
          if (parseFloat(a[i].slice(1)) / 100 > rand()) {
            unequipItem(defMon);
          }
          break;
        }
      }
    }
  }
  status.EndCheck(offMon);
  changeTurn(bWnd[iWnd].Turn, offMon, defMon);
}

function healMon(oMon) {
  if (obConf.Pref.healOn === false) {
    sendMsg(obTrans.GetMessages().GetString("HealDisabled"));
  } else {
    if (oMon.Status.Recharge === 1) {
      sendMsg(obTrans.GetMessages().GetString("MustRecharge").replace(/MON_NAME/, oMon.Name));
    } else {
      if (oMon.Status.ID === -1) {
        var intHeal = Math.ceil((oMon.Spc * statMod.Get(oMon, 3)) / obConf.Stat.SpcMax * rand() * oMon.HPMax / 10 + oMon.HPMax / 16);
        if (!isNaN(CHEAT)) {
          intHeal = CHEAT;
          CHEAT = undefined;
        }
        oMon.HPCur + intHeal > oMon.HPMax ? oMon.HPCur = oMon.HPMax : oMon.HPCur += intHeal;
        sendMsg(obTrans.GetMessages().GetString("HealSuccess").replace(/MON_NAME/, oMon.Name).replace(/NUMBER/, intHeal));
        displayHP(oMon);
      } else {
        if (occRate(oMon, obConf.OccRate.cure, "Spc") > rand()) {
          sendMsg(obTrans.GetMessages().GetString("StatusCured").replace(/MON_NAME/, oMon.Name));
          oMon.Status.ID = -1;
        } else {
          sendMsg(obTrans.GetMessages().GetString("HealFailed").replace(/MON_NAME/, oMon.Name));
        }
      }
      status.EndCheck(oMon);
      changeTurn(bWnd[iWnd].Turn, oMon, bWnd[iWnd].Player[bWnd[iWnd].Turn === 1 ? 2 : 1].Mon);
    }
  }
}

function occRate(oMon, decOcc, strStat) {
  switch (strStat) {
  case "Atk":
    id = 0;
    statmax = obConf.Stat.AtkMax;
    break;
  case "Def":
    id = 1;
    statmax = obConf.Stat.DefMax;
    break;
  case "Spe":
    id = 2;
    statmax = obConf.Stat.SpeMax;
    break;
  case "Spc":
    id = 3;
    statmax = obConf.Stat.SpcMax;
    break;
  case "HPMax":
    id = -1;
    statmax = obConf.Stat.HPMax;
    break;
  }
  //if the calculated occurance rate ends up greater than the maximum occ. rate, use the max occ. rate, else just use the calculated one 
  //it doesn't need the toFixed but it looks nicer in the debug
  var r = (decOcc * oMon[strStat] * (id >= 0 ? statMod.Get(oMon, id) / statmax : 1)).toFixed(3);
  return r >= decOcc ? decOcc : r;
}


var damageCalc = {
  Type: function (iMoveType, aDefType) {
    msgEffect = "";
    if (obConf.Pref.typesOn === true) {
      var t = aTypeMatchup[aDefType[0]][iMoveType] * (aDefType[1] !== undefined ? aTypeMatchup[aDefType[1]][iMoveType] : 1);
      t = t === 0 ? 0.5 : t; //types that would negate dmg are changed to 1/2
      if (t > 1) {
        msgEffect = obTrans.GetMessages().GetString("TypeVeryEff") + "\n";
      } else if (t < 1) {
        msgEffect = obTrans.GetMessages().GetString("TypeNotEff") + "\n";
      }
      // else if(t === 0){msgEffect = obTrans.GetMessages().GetString("TypeNoEff") + "\n";}
      return t;
    } else {
      return 1;
    }
  },
  Power: function () {
    var p = rand();
    //like Magnitude in the games
    // if(p >= .95) {return 150;}
    // else if(p >= .85 && p < .95) {return 110;}
    // else if(p >= .65 && p < .85) {return 90;}
    // else if(p >= .35 && p < .65) {return 70;}
    // else if(p >= .15 && p < .35) {return 50;}
    // else if(p >= .05 && p < .15) {return 30;}
    // else {return 10;}
    //it's been like the above since v2 but now I find the extremes too... extreme
    if (p >= .985) {
      return 140;
    } else if (p >= .90 && p < .985) {
      return 110;
    } else if (p >= .65 && p < .90) {
      return 90;
    } else if (p >= .35 && p < .65) {
      return 70;
    } else if (p >= .10 && p < .35) {
      return 50;
    } else if (p >= .015 && p < .10) {
      return 30;
    } else {
      return 15;
    }
  },
  Crit: function (Mon) {
    if (occRate(Mon, obConf.OccRate.crit, "Spe") > rand()) {
      msgCrit = obTrans.GetMessages().GetString("AtkCrit") + "\n";
      return 2;
    } else {
      msgCrit = "";
      return 1;
    }
  },
  STAB: function (monType, moveType) { //same type attack bonus
    if (monType[0] === moveType || monType[1] === moveType) {
      return 2;
    } else {
      return 1;
    }
  },
  Mod1: function (Mon) { //if burned, half power
    return Mon.Status.ID === 1 ? 0.5 : 1;
  }
}

//No, none of the filenames make any sense.

function CreateMon(strName) {
  this.Name = strName === "" ? randomPokemon().toUpperCase() : strName.toUpperCase();
  this.Atk = randomStat(obConf.Stat.AtkMin, obConf.Stat.AtkMax);
  this.Def = randomStat(obConf.Stat.DefMin, obConf.Stat.DefMax);
  this.Spe = randomStat(obConf.Stat.SpeMin, obConf.Stat.SpeMax);
  this.Spc = randomStat(obConf.Stat.SpcMin, obConf.Stat.SpcMax);
  this.HPMax = randomStat(obConf.Stat.HPMin, obConf.Stat.HPMax);
  this.HPCur = this.HPMax;
  this.Type = PokemonTypes(this.Name);
  this.Mod = [0, 0, 0, 0];
  this.Status = {
    "ID": -1,
    "Recharge": 0
  };
  this.Equip = {
    "Name": "",
    "Eff": ""
  };
}

function LoadMon(obMon) {
  this.Name = obMon.Name.toUpperCase();;
  this.Atk = parseInt(obMon.Atk);
  this.Def = parseInt(obMon.Def);
  this.Spe = parseInt(obMon.Spe);
  this.Spc = parseInt(obMon.Spc);
  this.HPMax = parseInt(obMon.HPMax);
  if (this.Atk === 0) {
    this.Atk = randomStat(obConf.Stat.AtkMin, obConf.Stat.AtkMax);
  }
  if (this.Def === 0) {
    this.Def = randomStat(obConf.Stat.DefMin, obConf.Stat.DefMax);
  }
  if (this.Spe === 0) {
    this.Spe = randomStat(obConf.Stat.SpeMin, obConf.Stat.SpeMax);
  }
  if (this.Spc === 0) {
    this.Spc = randomStat(obConf.Stat.SpcMin, obConf.Stat.SpcMax);
  }
  if (this.HPMax === 0) {
    this.HPMax = randomStat(obConf.Stat.HPMin, obConf.Stat.HPMax);
  }
  //this.HPCur = parseInt(obMon.HPCur,10);
  this.HPCur = this.HPMax;
  this.Type = obMon.Type;
  this.Mod = [0, 0, 0, 0];
  this.Status = {
    "ID": parseInt(obMon.Status),
    "Recharge": 0
  };
  this.Equip = {
    "Name": "",
    "Eff": ""
  };
}

function randomStat(min, max) {
  return Math.ceil(rand() * (max - min) + min);
}

function sendMsg(sMsg) {
  bWnd[iWnd].Wnd.SendMessage(obConf.Pref.msgFormat[0] + "*" + sMsg + obConf.Pref.msgFormat[1]);
}

function displayHP(Mon) {
  sendMsg(Mon.Name + ": " + Mon.HPCur + "\/" + Mon.HPMax + " HP");
}

function displayType(aType) {
  if (obConf.Pref.displayTypesOn === true) {
    return (obTrans.Types().GetString(aType[0]) + (aType[1] !== undefined ? ("," + obTrans.Types().GetString(aType[1])) : "")).toUpperCase();
  } else {
    return "???";
  }
}

function changeTurn(Turn, offMon, defMon) {
  //Debug.Trace("mon that just attacked was player "+Turn);
  if (defMon.HPCur > 0 && offMon.HPCur > 0) {
    bWnd[iWnd].Turn = (Turn === 1 ? 2 : 1);
    //Debug.Trace("switching to player "+bWnd[iWnd].Turn);
    if (defMon.Status.Recharge === 1) {
      defMon.Status.Recharge = 0;
      bWnd[iWnd].Turn = (bWnd[iWnd].Turn === 1 ? 2 : 1);
      //Debug.Trace("that player is recharging, switch back to player "+bWnd[iWnd].Turn);
      sendMsg(obTrans.GetMessages().GetString("MustRecharge").replace(/MON_NAME/, defMon.Name));
    }
  } else {
    if (offMon.HPCur <= 0) { //check the attackers's HP first, if both are 0, the defender wins
      var loser = bWnd[iWnd].Player[Turn].Name;
      var winner = bWnd[iWnd].Player[Turn === 1 ? 2 : 1].Name;
    } else {
      var loser = bWnd[iWnd].Player[Turn === 1 ? 2 : 1].Name;
      var winner = bWnd[iWnd].Player[Turn].Name;
    }
    sendMsg(obTrans.GetMessages().GetString("BattleEnd").replace(/PLAYER1_NAME/, winner).replace(/PLAYER2_NAME/, loser));
    bWnd.splice(iWnd, 1);
    if (winner === Messenger.MyName) {
      settings.UpdateRecord("win");
    } else if (loser === Messenger.MyName) {
      settings.UpdateRecord("lose");
    }
  }
}

function notYourTurn() {
  sendMsg(obTrans.GetMessages().GetString("NotYourTurn"));
}

function sanitizeStr(str) {
  return str.replace(/\[/g, "").replace(/\]/g, "").replace(/\;/g, "").replace(/\=/g, "");
}

/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <darktempler@gmail.com> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return Matt Labrum (-dt-)
 * ----------------------------------------------------------------------------
 */

var Translation = function (type) {
  type = type + ".xml";
  this.xml = w32Factory("Microsoft.XMLDOM");
  if (type.indexOf('.xml') === -1) {
    this.translationFile = type + ".xml";
  } else {
    this.translationFile = type;
  }
  this.LoadTranslation();
}


Translation.prototype = {
  "xml": false,
  "translationFile": "en.xml",
  "LanguageFolder": MsgPlus.ScriptFilesPath + "\\Lang\\",

  "GetAuthor": function () {
    var author = this.xml.selectNodes("/Translation/Author");
    return (author.length != 0) ? author[0].text : "Unknown";
  },

  "GetWebsite": function () {
    var website = this.xml.selectNodes("/Translation/Website");
    return (website.length != 0) ? website[0].text : "";
  },

  "LoadTranslation": function () {
    this.xml.load(this.LanguageFolder + this.translationFile);
    if (this.xml.parseError.errorCode) {
      var p = this.xml.parseError;
      Debug.Trace("Error loading Translation: Error: " + p.reason + " (" + p.errorCode + ") " + " Line:" + p.line);
    }

  },

  "TranslationList": function () {
    var fso = w32Factory('Scripting.FileSystemObject');
    var returns = [];
    for (var enume = new Enumerator(fso.GetFolder(this.LanguageFolder).Files); !enume.atEnd(); enume.moveNext()) {

      returns[returns.length] = String(enume.item()).match(/([^\\]*)\.xml$/)[1];
    }
    return returns;
  },

  "TranslateFile": function (xmlFile) {
    var filePath = xmlFile;
    var inter = w32Factory("Microsoft.XMLDOM");
    inter.load(filePath);

    var windows = this.xml.selectNodes("//Window");


    var wnd, id, twnd, controls, control, text, cControls, cElements, cColumns, cColumn, cControl, cElement, temp, title;
    for (var i = 0; i < windows.length; i++) {
      wnd = windows[i];
      id = wnd.getAttribute('Id');

      twnd = inter.selectNodes("//Window[@Id='" + id + "']");

      if (twnd.length == 1) {
        twnd = twnd[0];


        if (temp = wnd.selectSingleNode("Caption")) {
          title = twnd.selectSingleNode("Attributes/Caption");

          if (title) {
            title.text = temp.text;
          }
        }

        if (temp = wnd.selectSingleNode("TitleBar")) {
          title = twnd.selectSingleNode("TitleBar/Title/Text");
          if (title) {
            title.text = temp.text;
          }
        }

        controls = wnd.selectNodes("Control");
        for (var x = 0; x < controls.length; x++) {
          control = controls[x];

          if (control.hasChildNodes) {

            text = control.selectSingleNode("Caption");
            if (text) {

              temp = twnd.selectSingleNode(".//Control[@Id='" + control.getAttribute('Id') + "']/Caption");
              if (temp) {
                temp.text = text.text;
              } else {
                Debug.Trace('no node found for' + ".//Control[@Id='" + control.getAttribute('Id') + "']/Caption");
              }
            }


            text = control.selectSingleNode("Help");
            if (text) {
              temp = twnd.selectSingleNode(".//Control[@Id='" + control.getAttribute('Id') + "']/Help");
              if (temp) {
                temp.text = text.text;
              } else {
                Debug.Trace('no node found for' + ".//Control[@Id='" + control.getAttribute('Id') + "']/Help");
              }
            }
            cControls = control.selectNodes("Control");
            cElements = control.selectNodes("Element");

            cColumns = control.selectNodes("Column");

            for (var y = 0; y < cControls.length; y++) {
              cControl = cControls[y];

              if (cControl.hasChildNodes) {
                text = cControl.selectSingleNode("Caption");
                if (text) {
                  temp = twnd.selectNodes(".//Control[@Id='" + control.getAttribute('Id') + "']//Control[@Id='" + cControl.getAttribute('Id') + "']/Caption");
                  for (var z = 0; z < temp.length; z++) {
                    temp[z].text = text.text;
                  }
                }
              }
            }

            for (var y = 0; y < cElements.length; y++) {
              cElement = cElements[y];
              if (cElement.hasChildNodes) {

                text = cElement.selectSingleNode("Text");
                if (text) {

                  temp = twnd.selectNodes(".//Control[@Id='" + control.getAttribute('Id') + "']//Element[@Id='" + cElement.getAttribute('Id') + "']/Text");

                  for (var z = 0; z < temp.length; z++) {
                    temp[z].text = text.text;
                  }
                }
              }

            }

            for (var y = 0; y < cColumns.length; y++) {
              cColumn = cColumns[y];
              if (cColumn.hasChildNodes) {
                text = cColumn.selectSingleNode("Label");
                if (text) {
                  temp = twnd.selectNodes(".//Control[@Id='" + control.getAttribute('Id') + "']//Column[ColumnId='" + cColumn.getAttribute('Id') + "']/Label");
                  for (var z = 0; z < temp.length; z++) {
                    temp[z].text = text.text;
                  }
                }
              }
            }

          }


        }




      } else {
        continue;
      }
    }

    inter.save(filePath);
    return xmlFile;
  },


  "LoadWindow": function (XmlFile, WindowId) {
    var wnd = MsgPlus.CreateWnd(XmlFile, WindowId, 1);
    var wndStrings = this.GetWindow(WindowId).ToObject();

    for (x in wndStrings) {
      if (x == "Caption") {
        Interop.Call("User32", "SetWindowTextW", wnd.Handle, wndStrings[x]);
      } else if (x == "Title") {
        //api call to change the title here
        //not a clue how to do this though... :P
      } else {
        wnd.SetControlText(x, wndStrings[x]);
      }
    }
    wnd.Visible = true;
    return wnd;
  },

  "GetMenu": function (menuId) {
    var menu = this.xml.selectNodes("/Translation/ScriptMenu[@Id='" + menuId + "']");
    return (menu.length != 0) ? new this.window(menu[0]) : false;
  },

  "GetWindow": function (wndID) {
    var wnd = this.xml.selectNodes("/Translation/Window[@Id='" + wndID + "']");
    return (wnd.length != 0) ? new this.window(wnd[0]) : false;
  },

  "GetSpecialString": function (name) {
    var elements = this.xml.selectNodes("/Translation/" + name);
    return (elements.length != 0) ? elements[0].text : false;
  },

  "GetMessages": function () {
    var msg = this.xml.selectNodes("/Translation/Messages");
    return (msg.length != 0) ? new this.window(msg[0]) : false;
  },

  "Types": function () {
    var msg = this.xml.selectNodes("/Translation/Types");
    return (msg.length != 0) ? new this.window(msg[0]) : false;
  }
}

Translation.prototype.window = function (windowObj) {
  this.xml = windowObj;
}

Translation.prototype.window.prototype = {
  "GetString": function (id) {
    var str = this.xml.selectNodes("String[@Id='" + id + "']");
    return (str.length != 0) ? str[0].text : false;
  },

  "GetStringBundle": function (id) {
    var bundle = this.xml.selectNodes("StringBundle[@Id='" + id + "']");
    return (bundle.length != 0) ? new this.StringBundle(bundle[0]) : false;
  },

  "ToObject": function () {
    var elements = this.xml.selectNodes("*");
    var returns = {};
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].nodeType == 1) {

        if (elements[i].tagName == "String") {
          returns[elements[i].getAttribute('Id')] = elements[i].text;
        } else if (elements[i].tagName == "StringBundle") {
          var bundle = new this.StringBundle(elements[i]);
          returns[elements[i].getAttribute('Id')] = bundle.GetDefault();
        } else {
          returns[elements[i].tagName] = elements[i].text;
        }
      }
    }
    return returns;
  },

  "StringBundle": function (bundleObj) {
    this.xml = bundleObj;

  }
}

Translation.prototype.window.prototype.StringBundle.prototype = {
  "ToObject": function () {
    var nodes = this.xml.selectNodes("String");
    var returns = {};
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType == 1) {
        returns[nodes[i].getAttribute("Id")] = nodes[i].text;
      }
    }
    return returns;
  },

  "GetDefault": function () {
    var str = this.xml.selectNodes("Default");
    return (str.length != 0) ? str[0].text : false;
  },

  "GetString": function (id) {
    var str = this.xml.selectNodes("String[@Id='" + id + "']");
    return (str.length != 0) ? str[0].text : false;
  }

}

var iniIntf = {
  DeleteHeader: function (filename, header) {
    //The following Read/Write/Del code was taken and modified from a post within the MsgPlus! forums http://www.msghelp.net/showthread.php?tid=83351&pid=904319#pid904319
    Interop.Call("kernel32", "WritePrivateProfileSectionW", header.toString(), 0, MsgPlus.ScriptFilesPath + "\\config\\" + filename + ".ini")
  },
  DeleteKey: function (filename, header, key) {
    Interop.Call("kernel32", "WritePrivateProfileStringW", header.toString(), key.toString(), 0, MsgPlus.ScriptFilesPath + "\\config\\" + filename + ".ini")
  },
  WriteIni: function (filename, header, key, value) {
    Interop.Call("kernel32", "WritePrivateProfileStringW", header.toString(), key.toString(), value.toString(), MsgPlus.ScriptFilesPath + "\\config\\" + filename + ".ini");
  },
  ReadIni: function (filename, header, key, default_value) {
    cRetVal = Interop.Allocate(2 * (256 + 1));
    lTmp = Interop.Call("kernel32", "GetPrivateProfileStringW", header, key.toString(), default_value.toString(), cRetVal, cRetVal.Size, MsgPlus.ScriptFilesPath + "\\config\\" + filename + ".ini");
    return lTmp === 0 ? default_value : cRetVal.ReadString(0);
  },

  ToObject: function (sIniName) {
    //The following ToObject code was taken and modified from http://mpscripts.net/code.php?id=12
    var fso = w32Factory("Scripting.FileSystemObject");
    var data = fso.GetFile(MsgPlus.ScriptFilesPath + "\\config\\" + sIniName + ".ini").OpenAsTextStream(1, -1).ReadAll();
    var ob = {};
    data = data.replace(/^;(.*)$\r\n/gm, "");
    var sectionNames = data.match(/^\[(.*?)\]/gm);
    var sections = data.split(/^\[.*?\]/gm);
    if (sectionNames !== null) {
      for (i = 0; i < sections.length; i++) {
        sectionName = sectionNames[i].replace(/[\[\]]/g, "");
        ob[sectionName] = {};
        var v = sections[i].match(/^(.*?)=(.*?)$/gm);
        if (v) {
          for (var x = 0; x < v.length; x++) {
            var sp = v[x].split("=", 2);
            if (sp[1] === "true") {
              sp[1] = true;
            } else if (sp[1] === "false") {
              sp[1] = false;
            } else if (isFinite(sp[1]) === true) {
              sp[1] = parseFloat(sp[1]);
            }
            ob[sectionName][sp[0]] = sp[1];
          }
        }
      }
    }
    return ob;
  }
};

function useItem(Player, itemName, itemEff) {
  var oMon = Player.Mon;
  sendMsg(obTrans.GetMessages().GetString("ItemUsed").replace(/PLAYER_NAME/, Player.Name).replace(/ITEM_NAME/, itemName.toUpperCase()));
  var a = itemEff.match(/([amp]\d[\+\-]\d*)|(h\d*)|c|s\d*/gi);
  for (i = 0; i < a.length; i++) {
    switch (a[i].charAt(0)) {
    case "a":
      statMod.Set.Absolute(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
      break;
    case "m":
      statMod.Set.Relative(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
      break;
    case "p":
      statMod.Set.Percent(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
      break;
    case "h":
      i = a[i].charAt(1) === "0" ? Math.ceil(parseInt(a[i].slice(2), 10) * oMon.HPMax / 100) : parseInt(a[i].slice(2), 10);
      oMon.HPCur + i > oMon.HPMax ? oMon.HPCur = oMon.HPMax : oMon.HPCur += i;
      sendMsg(obTrans.GetMessages().GetString("HealSuccess").replace(/MON_NAME/, oMon.Name).replace(/NUMBER/, i));
      displayHP(oMon);
      break;
    case "c":
      oMon.Status.ID = -1;
      sendMsg(obTrans.GetMessages().GetString("StatusCured").replace(/MON_NAME/, oMon.Name));
      break;
    case "s":
      status.Set(oMon, parseInt(a[i].charAt(1)));
      break;
    }
  }
  status.EndCheck(oMon);
  changeTurn(bWnd[iWnd].Turn, oMon, bWnd[iWnd].Player[bWnd[iWnd].Turn === 1 ? 2 : 1].Mon);
}

function equipItem(oMon, itemName, itemEff, itemMsg) {
  if (oMon.Equip.Name === "") {
    oMon.Equip.Name = itemName;
    oMon.Equip.Eff = itemEff;
    sendMsg(obTrans.GetMessages().GetString("ItemEquipped").replace(/MON_NAME/, oMon.Name).replace(/ITEM_NAME/, itemName.toUpperCase()) + " " + itemMsg);
    var a = itemEff.match(/[amp]\d[\+\-]\d*|s\d*/gi);
    if (a !== null) {
      for (var i = 0; i < a.length; i++) {
        switch (a[i].charAt(0)) {
        case "a":
          statMod.Set.Absolute(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
          break;
        case "m":
          statMod.Set.Relative(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
          break;
        case "p":
          statMod.Set.Percent(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
          break;
        case "s":
          status.Set(oMon, parseInt(a[i].charAt(1)));
          break;
        }
      }
    }
    changeTurn(bWnd[iWnd].Turn, oMon, bWnd[iWnd].Player[bWnd[iWnd].Turn === 1 ? 2 : 1].Mon);
  } else {
    sendMsg(obTrans.GetMessages().GetString("AlreadyEquipped"));
  }
}

function unequipItem(oMon) {
  if (oMon.Equip.Name !== "") {
    sendMsg(obTrans.GetMessages().GetString("ItemUnequipped").replace(/MON_NAME/, oMon.Name).replace(/ITEM_NAME/, oMon.Equip.Name.toUpperCase()));
    //Reverse stat changes
    a = oMon.Equip.Eff.match(/[amp]\d[\+\-]\d*/gi);
    if (a !== null) {
      for (i = 0; i < a.length; i++) {
        switch (a[i].charAt(0)) {
        case "a":
          statMod.Set.Absolute(oMon, parseInt(a[i].charAt(1), 10), -parseInt(a[i].slice(2), 10));
          break;
        case "m":
          statMod.Set.Relative(oMon, parseInt(a[i].charAt(1), 10), -parseInt(a[i].slice(2), 10));
          break;
        case "p":
          statMod.Set.Percent(oMon, parseInt(a[i].charAt(1), 10), -parseInt(a[i].slice(2), 10));
          break;
        }
      }
    }
    oMon.Equip.Name = "";
    oMon.Equip.Eff = "";
  } else {
    sendMsg(obTrans.GetMessages().GetString("NoEquip"));
  }
}

function OnGetScriptMenu() {
  var sMenu = "<ScriptMenu>";
  sMenu += "<SubMenu Label=\"Language\">";
  var languages = obTrans.TranslationList();
  for (var i in languages) {
    sMenu += "<MenuEntry Id=\"" + languages[i] + "\">" + languages[i] + "</MenuEntry>";
  }
  sMenu += "</SubMenu>";
  obConf.Pref.enabled === true ?
    sMenu += "<MenuEntry Id=\"Enabled\">" + obTrans.GetMenu("Menu").GetString("Disable") + "</MenuEntry>" :
    sMenu += "<MenuEntry Id=\"Enabled\">" + obTrans.GetMenu("Menu").GetString("Enable") + "</MenuEntry>";
  sMenu += "<MenuEntry Id=\"Config\">" + obTrans.GetMenu("Menu").GetString("Config") + "</MenuEntry>";
  sMenu += "<MenuEntry Id=\"Shop\">" + obTrans.GetMenu("Menu").GetString("Shop") + "</MenuEntry>";
  sMenu += "<MenuEntry Id=\"Equip\">" + obTrans.GetMenu("Menu").GetString("Equip") + "</MenuEntry>";
  sMenu += "<MenuEntry Id=\"Mons\">" + obTrans.GetMenu("Menu").GetString("Mons") + "</MenuEntry>";
  sMenu += "<MenuEntry Id=\"Moves\">" + obTrans.GetMenu("Menu").GetString("Moves") + "</MenuEntry>";
  sMenu += "<MenuEntry Id=\"Commands\">" + obTrans.GetMenu("Menu").GetString("Commands") + "</MenuEntry>";
  sMenu += "<MenuEntry Id=\"Reload\">" + obTrans.GetMenu("Menu").GetString("Reload") + "</MenuEntry>";
  sMenu += "<MenuEntry Id=\"About\">" + obTrans.GetMenu("Menu").GetString("About") + "</MenuEntry>";
  sMenu += "</ScriptMenu>";
  return sMenu;
}

function OnEvent_MenuClicked(MenuID) { // TODO - Missing polyfill
  switch (MenuID) {
  case "Enabled":
    obConf.Pref.enabled = obConf.Pref.enabled === true ? false : true;
    break;
  case "Reload":
    settings.LoadScript();
    break;
  case "Config":
    loadPrefsWnd(configWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndConfig"));
    break;
  case "Shop":
    loadShopWnd(shopWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndShop"));
    break;
  case "Equip":
    loadEquipWnd(equipWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndEquip"));
    break;
  case "Mons":
    loadMonWnd(monWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndMons"));
    break;
  case "Commands":
    loadCmdWnd(cmdWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndCommands"));
    break;
  case "Moves":
    loadMoveWnd(moveWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndMoves"));
    break;
  case "About":
    MsgPlus.CreateWnd("XMLWindows.xml", "WndAbout");
    break;
  default:
    settings.SetLanguage(MenuID);
  }
}

function OnEvent_Initialize() { // TODO - Missing polyfill
  //Debug.ClearDebuggingWindow();
  //v5.0 has a lot of changes, so only restore if it's already at least v5.0
  currentVersion = parseFloat(iniIntf.ReadIni("settings", "Version", "current", 5));
  previousVersion = parseFloat(iniIntf.ReadIni("settings", "Version", "previous", 4));
  if (previousVersion >= 5) {
    settings.Restore();
    settings.LoadScript();
  } else {
    settings.Save("Version", "previous", currentVersion, false);
    settings.LoadScript();
    settings.Backup();
  }
}

function OnEvent_Uninitialize() { // TODO - Missing polyfill
  settings.Backup();
}

var settings = {
  LoadScript: function () {
    for (f in settings.LoadFile) {
      settings.LoadFile[f]();
    }
    obConf.Pref.enabled = true;
    obTrans = new Translation(obConf.Pref.lang);
    obTrans.TranslateFile(MsgPlus.ScriptFilesPath + "\\XMLWindows.xml");
    bWnd = [];
    //seed = "Sun Sep 30 19:32:52 CDT 2012";
    seed = new Date();
    Debug.Trace("Seed: " + seed);
    rand = new Alea(seed);
    Debug.Trace("Script loaded.");
    settings.Debug(obConf.Pref);
  },
  LoadFile: {
    Conf: function () {
      obConf = iniIntf.ToObject("settings");
      obConf.Pref.msgFormat = iniIntf.ReadIni("settings", "Pref", "msgFormat", "$MSG").split("$MSG");
      //obConf.Pref.msgFormat = ["[c=3]","[\/c]"];
    },
    Cmd: function () {
      obCmds = iniIntf.ToObject("settings").Commands;
    },
    Equip: function () {
      obEquipDB = iniIntf.ToObject("equipDB");
    },
    Item: function () {
      obItemDB = iniIntf.ToObject("itemDB");
    },
    Move: function () {
      obMoveDB = iniIntf.ToObject("moveDB");
    },
    Mon: function () {
      obMonParty = iniIntf.ToObject("monParty");
      for (p in obMonParty) {
        if (typeof (obMonParty[p].Type) === "string" && obMonParty[p].Type.split(",").length > 1) {
          obMonParty[p].Type = [parseInt(obMonParty[p].Type.split(",")[0]), parseInt(obMonParty[p].Type.split(",")[1])];
        } else {
          obMonParty[p].Type = [obMonParty[p].Type];
        }
      }
    }
  },
  Save: function (header, key, value, isInt) {
    if (isInt === true) {
      value = parseInt(value);
      if (header === "OccRate") {
        value /= 100;
      }
      if (isNaN(value) === true) {
        Debug.Trace(header + ": " + key + "; Invalid number");
        return false;
      }
    }
    iniIntf.WriteIni("settings", header, key, value);
    // Debug.Trace(header + ": " + key + "; Setting saved");
    return true;
  },
  Backup: function () {
    try {
      var fso = w32Factory("Scripting.FileSystemObject");
      fso.CopyFolder(MsgPlus.ScriptFilesPath + "\\config", MsgPlus.ScriptFilesPath + "\\configbackup");
      Debug.Trace("Settings backup'd.");
    } catch (e) {
      Debug.Trace("BACKUP FAILED; catch: " + e);
    }
  },
  Restore: function () {
    try {
      var fso = w32Factory("Scripting.FileSystemObject");
      fso.CopyFolder(MsgPlus.ScriptFilesPath + "\\configbackup", MsgPlus.ScriptFilesPath + "\\config");
      Debug.Trace("Settings restored.");
    } catch (e) {
      Debug.Trace("RESTORE FAILED; catch: " + e);
    }
  },
  SetLanguage: function (str) {
    obTrans = new Translation(str);
    obTrans.TranslateFile(MsgPlus.ScriptFilesPath + "\\XMLWindows.xml");
    settings.Save("Pref", "lang", str);
  },
  UpdateRecord: function (prop) {
    obConf.Record[prop] += 1;
    iniIntf.WriteIni("settings", "record", prop, obConf.Record[prop]);
  },
  Debug: function (ob) {
    for (var p in ob) {
      Debug.Trace(p + ": " + ob[p]);
    }
  }
};

function randomPokemon() {
  switch (Math.ceil(rand() * 649)) {
  case 1:
    return "Bulbasaur";
  case 2:
    return "Ivysaur";
  case 3:
    return "Venusaur";
  case 4:
    return "Charmander";
  case 5:
    return "Charmeleon";
  case 6:
    return "Charizard";
  case 7:
    return "Squirtle";
  case 8:
    return "Wartortle";
  case 9:
    return "Blastoise";
  case 10:
    return "Caterpie";
  case 11:
    return "Metapod";
  case 12:
    return "Butterfree";
  case 13:
    return "Weedle";
  case 14:
    return "Kakuna";
  case 15:
    return "Beedrill";
  case 16:
    return "Pidgey";
  case 17:
    return "Pidgeotto";
  case 18:
    return "Pidgeot";
  case 19:
    return "Rattata";
  case 20:
    return "Raticate";
  case 21:
    return "Spearow";
  case 22:
    return "Fearow";
  case 23:
    return "Ekans";
  case 24:
    return "Arbok";
  case 25:
    return "Pikachu";
  case 26:
    return "Raichu";
  case 27:
    return "Sandshrew";
  case 28:
    return "Sandslash";
  case 29:
    return "Nidoran";
  case 30:
    return "Nidorina";
  case 31:
    return "Nidoqueen";
  case 32:
    return "Nidoran";
  case 33:
    return "Nidorino";
  case 34:
    return "Nidoking";
  case 35:
    return "Clefairy";
  case 36:
    return "Clefable";
  case 37:
    return "Vulpix";
  case 38:
    return "Ninetales";
  case 39:
    return "Jigglypuff";
  case 40:
    return "Wigglytuff";
  case 41:
    return "Zubat";
  case 42:
    return "Golbat";
  case 43:
    return "Oddish";
  case 44:
    return "Gloom";
  case 45:
    return "Vileplume";
  case 46:
    return "Paras";
  case 47:
    return "Parasect";
  case 48:
    return "Venonat";
  case 49:
    return "Venomoth";
  case 50:
    return "Diglett";
  case 51:
    return "Dugtrio";
  case 52:
    return "Meowth";
  case 53:
    return "Persian";
  case 54:
    return "Psyduck";
  case 55:
    return "Golduck";
  case 56:
    return "Mankey";
  case 57:
    return "Primeape";
  case 58:
    return "Growlithe";
  case 59:
    return "Arcanine";
  case 60:
    return "Poliwag";
  case 61:
    return "Poliwhirl";
  case 62:
    return "Poliwrath";
  case 63:
    return "Abra";
  case 64:
    return "Kadabra";
  case 65:
    return "Alakazam";
  case 66:
    return "Machop";
  case 67:
    return "Machoke";
  case 68:
    return "Machamp";
  case 69:
    return "Bellsprout";
  case 70:
    return "Weepinbell";
  case 71:
    return "Victreebel";
  case 72:
    return "Tentacool";
  case 73:
    return "Tentacruel";
  case 74:
    return "Geodude";
  case 75:
    return "Graveler";
  case 76:
    return "Golem";
  case 77:
    return "Ponyta";
  case 78:
    return "Rapidash";
  case 79:
    return "Slowpoke";
  case 80:
    return "Slowbro";
  case 81:
    return "Magnemite";
  case 82:
    return "Magneton";
  case 83:
    return "Farfetch'd";
  case 84:
    return "Doduo";
  case 85:
    return "Dodrio";
  case 86:
    return "Seel";
  case 87:
    return "Dewgong";
  case 88:
    return "Grimer";
  case 89:
    return "Muk";
  case 90:
    return "Shellder";
  case 91:
    return "Cloyster";
  case 92:
    return "Gastly";
  case 93:
    return "Haunter";
  case 94:
    return "Gengar";
  case 95:
    return "Onix";
  case 96:
    return "Drowzee";
  case 97:
    return "Hypno";
  case 98:
    return "Krabby";
  case 99:
    return "Kingler";
  case 100:
    return "Voltorb";
  case 101:
    return "Electrode";
  case 102:
    return "Exeggcute";
  case 103:
    return "Exeggutor";
  case 104:
    return "Cubone";
  case 105:
    return "Marowak";
  case 106:
    return "Hitmonlee";
  case 107:
    return "Hitmonchan";
  case 108:
    return "Lickitung";
  case 109:
    return "Koffing";
  case 110:
    return "Weezing";
  case 111:
    return "Rhyhorn";
  case 112:
    return "Rhydon";
  case 113:
    return "Chansey";
  case 114:
    return "Tangela";
  case 115:
    return "Kangaskhan";
  case 116:
    return "Horsea";
  case 117:
    return "Seadra";
  case 118:
    return "Goldeen";
  case 119:
    return "Seaking";
  case 120:
    return "Staryu";
  case 121:
    return "Starmie";
  case 122:
    return "Mr. Mime";
  case 123:
    return "Scyther";
  case 124:
    return "Jynx";
  case 125:
    return "Electabuzz";
  case 126:
    return "Magmar";
  case 127:
    return "Pinsir";
  case 128:
    return "Tauros";
  case 129:
    return "Magikarp";
  case 130:
    return "Gyarados";
  case 131:
    return "Lapras";
  case 132:
    return "Ditto";
  case 133:
    return "Eevee";
  case 134:
    return "Vaporeon";
  case 135:
    return "Jolteon";
  case 136:
    return "Flareon";
  case 137:
    return "Porygon";
  case 138:
    return "Omanyte";
  case 139:
    return "Omastar";
  case 140:
    return "Kabuto";
  case 141:
    return "Kabutops";
  case 142:
    return "Aerodactyl";
  case 143:
    return "Snorlax";
  case 144:
    return "Articuno";
  case 145:
    return "Zapdos";
  case 146:
    return "Moltres";
  case 147:
    return "Dratini";
  case 148:
    return "Dragonair";
  case 149:
    return "Dragonite";
  case 150:
    return "Mewtwo";
  case 151:
    return "Mew";
  case 152:
    return "Chikorita";
  case 153:
    return "Bayleef";
  case 154:
    return "Meganium";
  case 155:
    return "Cyndaquil";
  case 156:
    return "Quilava";
  case 157:
    return "Typhlosion";
  case 158:
    return "Totodile";
  case 159:
    return "Croconaw";
  case 160:
    return "Feraligatr";
  case 161:
    return "Sentret";
  case 162:
    return "Furret";
  case 163:
    return "Hoothoot";
  case 164:
    return "Noctowl";
  case 165:
    return "Ledyba";
  case 166:
    return "Ledian";
  case 167:
    return "Spinarak";
  case 168:
    return "Ariados";
  case 169:
    return "Crobat";
  case 170:
    return "Chinchou";
  case 171:
    return "Lanturn";
  case 172:
    return "Pichu";
  case 173:
    return "Cleffa";
  case 174:
    return "Igglybuff";
  case 175:
    return "Togepi";
  case 176:
    return "Togetic";
  case 177:
    return "Natu";
  case 178:
    return "Xatu";
  case 179:
    return "Mareep";
  case 180:
    return "Flaaffy";
  case 181:
    return "Ampharos";
  case 182:
    return "Bellossom";
  case 183:
    return "Marill";
  case 184:
    return "Azumarill";
  case 185:
    return "Sudowoodo";
  case 186:
    return "Politoed";
  case 187:
    return "Hoppip";
  case 188:
    return "Skiploom";
  case 189:
    return "Jumpluff";
  case 190:
    return "Aipom";
  case 191:
    return "Sunkern";
  case 192:
    return "Sunflora";
  case 193:
    return "Yanma";
  case 194:
    return "Wooper";
  case 195:
    return "Quagsire";
  case 196:
    return "Espeon";
  case 197:
    return "Umbreon";
  case 198:
    return "Murkrow";
  case 199:
    return "Slowking";
  case 200:
    return "Misdreavus";
  case 201:
    return "Unown";
  case 202:
    return "Wobbuffet";
  case 203:
    return "Girafarig";
  case 204:
    return "Pineco";
  case 205:
    return "Forretress";
  case 206:
    return "Dunsparce";
  case 207:
    return "Gligar";
  case 208:
    return "Steelix";
  case 209:
    return "Snubbull";
  case 210:
    return "Granbull";
  case 211:
    return "Qwilfish";
  case 212:
    return "Scizor";
  case 213:
    return "Shuckle";
  case 214:
    return "Heracross";
  case 215:
    return "Sneasel";
  case 216:
    return "Teddiursa";
  case 217:
    return "Ursaring";
  case 218:
    return "Slugma";
  case 219:
    return "Magcargo";
  case 220:
    return "Swinub";
  case 221:
    return "Piloswine";
  case 222:
    return "Corsola";
  case 223:
    return "Remoraid";
  case 224:
    return "Octillery";
  case 225:
    return "Delibird";
  case 226:
    return "Mantine";
  case 227:
    return "Skarmory";
  case 228:
    return "Houndour";
  case 229:
    return "Houndoom";
  case 230:
    return "Kingdra";
  case 231:
    return "Phanpy";
  case 232:
    return "Donphan";
  case 233:
    return "Porygon2";
  case 234:
    return "Stantler";
  case 235:
    return "Smeargle";
  case 236:
    return "Tyrogue";
  case 237:
    return "Hitmontop";
  case 238:
    return "Smoochum";
  case 239:
    return "Elekid";
  case 240:
    return "Magby";
  case 241:
    return "Miltank";
  case 242:
    return "Blissey";
  case 243:
    return "Raikou";
  case 244:
    return "Entei";
  case 245:
    return "Suicune";
  case 246:
    return "Larvitar";
  case 247:
    return "Pupitar";
  case 248:
    return "Tyranitar";
  case 249:
    return "Lugia";
  case 250:
    return "Ho-oh";
  case 251:
    return "Celebi";
  case 252:
    return "Treecko";
  case 253:
    return "Grovyle";
  case 254:
    return "Sceptile";
  case 255:
    return "Torchic";
  case 256:
    return "Combusken";
  case 257:
    return "Blaziken";
  case 258:
    return "Mudkip";
  case 259:
    return "Marshtomp";
  case 260:
    return "Swampert";
  case 261:
    return "Poochyena";
  case 262:
    return "Mightyena";
  case 263:
    return "Zigzagoon";
  case 264:
    return "Linoone";
  case 265:
    return "Wurmple";
  case 266:
    return "Silcoon";
  case 267:
    return "Beautifly";
  case 268:
    return "Cascoon";
  case 269:
    return "Dustox";
  case 270:
    return "Lotad";
  case 271:
    return "Lombre";
  case 272:
    return "Ludicolo";
  case 273:
    return "Seedot";
  case 274:
    return "Nuzleaf";
  case 275:
    return "Shiftry";
  case 276:
    return "Taillow";
  case 277:
    return "Swellow";
  case 278:
    return "Wingull";
  case 279:
    return "Pelipper";
  case 280:
    return "Ralts";
  case 281:
    return "Kirlia";
  case 282:
    return "Gardevoir";
  case 283:
    return "Surskit";
  case 284:
    return "Masquerain";
  case 285:
    return "Shroomish";
  case 286:
    return "Breloom";
  case 287:
    return "Slakoth";
  case 288:
    return "Vigoroth";
  case 289:
    return "Slaking";
  case 290:
    return "Nincada";
  case 291:
    return "Ninjask";
  case 292:
    return "Shedinja";
  case 293:
    return "Whismur";
  case 294:
    return "Loudred";
  case 295:
    return "Exploud";
  case 296:
    return "Makuhita";
  case 297:
    return "Hariyama";
  case 298:
    return "Azurill";
  case 299:
    return "Nosepass";
  case 300:
    return "Skitty";
  case 301:
    return "Delcatty";
  case 302:
    return "Sableye";
  case 303:
    return "Mawile";
  case 304:
    return "Aron";
  case 305:
    return "Lairon";
  case 306:
    return "Aggron";
  case 307:
    return "Meditite";
  case 308:
    return "Medicham";
  case 309:
    return "Electrike";
  case 310:
    return "Manectric";
  case 311:
    return "Plusle";
  case 312:
    return "Minun";
  case 313:
    return "Volbeat";
  case 314:
    return "Illumise";
  case 315:
    return "Roselia";
  case 316:
    return "Gulpin";
  case 317:
    return "Swalot";
  case 318:
    return "Carvanha";
  case 319:
    return "Sharpedo";
  case 320:
    return "Wailmer";
  case 321:
    return "Wailord";
  case 322:
    return "Numel";
  case 323:
    return "Camerupt";
  case 324:
    return "Torkoal";
  case 325:
    return "Spoink";
  case 326:
    return "Grumpig";
  case 327:
    return "Spinda";
  case 328:
    return "Trapinch";
  case 329:
    return "Vibrava";
  case 330:
    return "Flygon";
  case 331:
    return "Cacnea";
  case 332:
    return "Cacturne";
  case 333:
    return "Swablu";
  case 334:
    return "Altaria";
  case 335:
    return "Zangoose";
  case 336:
    return "Seviper";
  case 337:
    return "Lunatone";
  case 338:
    return "Solrock";
  case 339:
    return "Barboach";
  case 340:
    return "Whiscash";
  case 341:
    return "Corphish";
  case 342:
    return "Crawdaunt";
  case 343:
    return "Baltoy";
  case 344:
    return "Claydol";
  case 345:
    return "Lileep";
  case 346:
    return "Cradily";
  case 347:
    return "Anorith";
  case 348:
    return "Armaldo";
  case 349:
    return "Feebas";
  case 350:
    return "Milotic";
  case 351:
    return "Castform";
  case 352:
    return "Kecleon";
  case 353:
    return "Shuppet";
  case 354:
    return "Banette";
  case 355:
    return "Duskull";
  case 356:
    return "Dusclops";
  case 357:
    return "Tropius";
  case 358:
    return "Chimecho";
  case 359:
    return "Absol";
  case 360:
    return "Wynaut";
  case 361:
    return "Snorunt";
  case 362:
    return "Glalie";
  case 363:
    return "Spheal";
  case 364:
    return "Sealeo";
  case 365:
    return "Walrein";
  case 366:
    return "Clamperl";
  case 367:
    return "Huntail";
  case 368:
    return "Gorebyss";
  case 369:
    return "Relicanth";
  case 370:
    return "Luvdisc";
  case 371:
    return "Bagon";
  case 372:
    return "Shelgon";
  case 373:
    return "Salamence";
  case 374:
    return "Beldum";
  case 375:
    return "Metang";
  case 376:
    return "Metagross";
  case 377:
    return "Regirock";
  case 378:
    return "Regice";
  case 379:
    return "Registeel";
  case 380:
    return "Latias";
  case 381:
    return "Latios";
  case 382:
    return "Kyogre";
  case 383:
    return "Groudon";
  case 384:
    return "Rayquaza";
  case 385:
    return "Jirachi";
  case 386:
    return "Deoxys";
  case 387:
    return "Turtwig";
  case 388:
    return "Grotle";
  case 389:
    return "Torterra";
  case 390:
    return "Chimchar";
  case 391:
    return "Monferno";
  case 392:
    return "Infernape";
  case 393:
    return "Piplup";
  case 394:
    return "Prinplup";
  case 395:
    return "Empoleon";
  case 396:
    return "Starly";
  case 397:
    return "Staravia";
  case 398:
    return "Staraptor";
  case 399:
    return "Bidoof";
  case 400:
    return "Bibarel";
  case 401:
    return "Kricketot";
  case 402:
    return "Kricketune";
  case 403:
    return "Shinx";
  case 404:
    return "Luxio";
  case 405:
    return "Luxray";
  case 406:
    return "Budew";
  case 407:
    return "Roserade";
  case 408:
    return "Cranidos";
  case 409:
    return "Rampardos";
  case 410:
    return "Shieldon";
  case 411:
    return "Bastiodon";
  case 412:
    return "Burmy";
  case 413:
    return "Wormadam";
  case 414:
    return "Mothim";
  case 415:
    return "Combee";
  case 416:
    return "Vespiquen";
  case 417:
    return "Pachirisu";
  case 418:
    return "Buizel";
  case 419:
    return "Floatzel";
  case 420:
    return "Cherubi";
  case 421:
    return "Cherrim";
  case 422:
    return "Shellos";
  case 423:
    return "Gastrodon";
  case 424:
    return "Ambipom";
  case 425:
    return "Drifloon";
  case 426:
    return "Drifblim";
  case 427:
    return "Buneary";
  case 428:
    return "Lopunny";
  case 429:
    return "Mismagius";
  case 430:
    return "Honchkrow";
  case 431:
    return "Glameow";
  case 432:
    return "Purugly";
  case 433:
    return "Chingling";
  case 434:
    return "Stunky";
  case 435:
    return "Skuntank";
  case 436:
    return "Bronzor";
  case 437:
    return "Bronzong";
  case 438:
    return "Bonsly";
  case 439:
    return "Mime Jr.";
  case 440:
    return "Happiny";
  case 441:
    return "Chatot";
  case 442:
    return "Spiritomb";
  case 443:
    return "Gible";
  case 444:
    return "Gabite";
  case 445:
    return "Garchomp";
  case 446:
    return "Munchlax";
  case 447:
    return "Riolu";
  case 448:
    return "Lucario";
  case 449:
    return "Hippopotas";
  case 450:
    return "Hippowdon";
  case 451:
    return "Skorupi";
  case 452:
    return "Drapion";
  case 453:
    return "Croagunk";
  case 454:
    return "Toxicroak";
  case 455:
    return "Carnivine";
  case 456:
    return "Finneon";
  case 457:
    return "Lumineon";
  case 458:
    return "Mantyke";
  case 459:
    return "Snover";
  case 460:
    return "Abomasnow";
  case 461:
    return "Weavile";
  case 462:
    return "Magnezone";
  case 463:
    return "Lickilicky";
  case 464:
    return "Rhyperior";
  case 465:
    return "Tangrowth";
  case 466:
    return "Electivire";
  case 467:
    return "Magmortar";
  case 468:
    return "Togekiss";
  case 469:
    return "Yanmega";
  case 470:
    return "Leafeon";
  case 471:
    return "Glaceon";
  case 472:
    return "Gliscor";
  case 473:
    return "Mamoswine";
  case 474:
    return "Porygon-Z";
  case 475:
    return "Gallade";
  case 476:
    return "Probopass";
  case 477:
    return "Dusknoir";
  case 478:
    return "Froslass";
  case 479:
    return "Rotom";
  case 480:
    return "Uxie";
  case 481:
    return "Mesprit";
  case 482:
    return "Azelf";
  case 483:
    return "Dialga";
  case 484:
    return "Palkia";
  case 485:
    return "Heatran";
  case 486:
    return "Regigigas";
  case 487:
    return "Giratina";
  case 488:
    return "Cresselia";
  case 489:
    return "Phione";
  case 490:
    return "Manaphy";
  case 491:
    return "Darkrai";
  case 492:
    return "Shaymin";
  case 493:
    return "Arceus";
    //5th Gen
  case 494:
    return "Victini";
  case 495:
    return "Snivy";
  case 496:
    return "Servine";
  case 497:
    return "Serperior";
  case 498:
    return "Tepig";
  case 499:
    return "Pignite";
  case 500:
    return "Emboar";
  case 501:
    return "Oshawott";
  case 502:
    return "Dewott";
  case 503:
    return "Samurott";
  case 504:
    return "Patrat";
  case 505:
    return "Watchog";
  case 506:
    return "Lillipup";
  case 507:
    return "Herdier";
  case 508:
    return "Stoutland";
  case 509:
    return "Purrloin";
  case 510:
    return "Liepard";
  case 511:
    return "Pansage";
  case 512:
    return "Simisage";
  case 513:
    return "Pansear";
  case 514:
    return "Simisear";
  case 515:
    return "Panpour";
  case 516:
    return "Simipour";
  case 517:
    return "Munna";
  case 518:
    return "Musharna";
  case 519:
    return "Pidove";
  case 520:
    return "Tranquill";
  case 521:
    return "Unfezant";
  case 522:
    return "Blitzle";
  case 523:
    return "Zebstrika";
  case 524:
    return "Roggenrola";
  case 525:
    return "Boldore";
  case 526:
    return "Gigalith";
  case 527:
    return "Woobat";
  case 528:
    return "Swoobat";
  case 529:
    return "Drilbur";
  case 530:
    return "Excadrill";
  case 531:
    return "Audino";
  case 532:
    return "Timburr";
  case 533:
    return "Gurdurr";
  case 534:
    return "Conkeldurr";
  case 535:
    return "Tympole";
  case 536:
    return "Palpitoad";
  case 537:
    return "Seismitoad";
  case 538:
    return "Throh";
  case 539:
    return "Sawk";
  case 540:
    return "Sewaddle";
  case 541:
    return "Swadloon";
  case 542:
    return "Leavanny";
  case 543:
    return "Venipede";
  case 544:
    return "Whirlipede";
  case 545:
    return "Scolipede";
  case 546:
    return "Cottonee";
  case 547:
    return "Whimsicott";
  case 548:
    return "Petilil";
  case 549:
    return "Lilligant";
  case 550:
    return "Basculin";
  case 551:
    return "Sandile";
  case 552:
    return "Krokorok";
  case 553:
    return "Krookodile";
  case 554:
    return "Darumaka";
  case 555:
    return "Darmanitan";
  case 556:
    return "Maractus";
  case 557:
    return "Dwebble";
  case 558:
    return "Crustle";
  case 559:
    return "Scraggy";
  case 560:
    return "Scrafty";
  case 561:
    return "Sigilyph";
  case 562:
    return "Yamask";
  case 563:
    return "Cofagrigus";
  case 564:
    return "Tirtouga";
  case 565:
    return "Carracosta";
  case 566:
    return "Archen";
  case 567:
    return "Archeops";
  case 568:
    return "Trubbish";
  case 569:
    return "Garbodor";
  case 570:
    return "Zorua";
  case 571:
    return "Zoroark";
  case 572:
    return "Minccino";
  case 573:
    return "Cinccino";
  case 574:
    return "Gothita";
  case 575:
    return "Gothorita";
  case 576:
    return "Gothitelle";
  case 577:
    return "Solosis";
  case 578:
    return "Duosion";
  case 579:
    return "Reuniclus";
  case 580:
    return "Ducklett";
  case 581:
    return "Swanna";
  case 582:
    return "Vanillite";
  case 583:
    return "Vanillish";
  case 584:
    return "Vanilluxe";
  case 585:
    return "Deerling";
  case 586:
    return "Sawsbuck";
  case 587:
    return "Emolga";
  case 588:
    return "Karrablast";
  case 589:
    return "Escavalier";
  case 590:
    return "Foongus";
  case 591:
    return "Amoonguss";
  case 592:
    return "Frillish";
  case 593:
    return "Jellicent";
  case 594:
    return "Alomomola";
  case 595:
    return "Joltik";
  case 596:
    return "Galvantula";
  case 597:
    return "Ferroseed";
  case 598:
    return "Ferrothorn";
  case 599:
    return "Klink";
  case 600:
    return "Klang";
  case 601:
    return "Klinklang";
  case 602:
    return "Tynamo";
  case 603:
    return "Eelektrik";
  case 604:
    return "Eelektross";
  case 605:
    return "Elgyem";
  case 606:
    return "Beheeyem";
  case 607:
    return "Litwick";
  case 608:
    return "Lampent";
  case 609:
    return "Chandelure";
  case 610:
    return "Axew";
  case 611:
    return "Fraxure";
  case 612:
    return "Haxorus";
  case 613:
    return "Cubchoo";
  case 614:
    return "Beartic";
  case 615:
    return "Cryogonal";
  case 616:
    return "Shelmet";
  case 617:
    return "Accelgor";
  case 618:
    return "Stunfisk";
  case 619:
    return "Mienfoo";
  case 620:
    return "Mienshao";
  case 621:
    return "Druddigon";
  case 622:
    return "Golett";
  case 623:
    return "Golurk";
  case 624:
    return "Pawniard";
  case 625:
    return "Bisharp";
  case 626:
    return "Bouffalant";
  case 627:
    return "Rufflet";
  case 628:
    return "Braviary";
  case 629:
    return "Vullaby";
  case 630:
    return "Mandibuzz";
  case 631:
    return "Heatmor";
  case 632:
    return "Durant";
  case 633:
    return "Deino";
  case 634:
    return "Zweilous";
  case 635:
    return "Hydreigon";
  case 636:
    return "Larvesta";
  case 637:
    return "Volcarona";
  case 638:
    return "Cobalion";
  case 639:
    return "Terrakion";
  case 640:
    return "Virizion";
  case 641:
    return "Tornadus";
  case 642:
    return "Thundurus";
  case 643:
    return "Reshiram";
  case 644:
    return "Zekrom";
  case 645:
    return "Landorus";
  case 646:
    return "Kyurem";
  case 647:
    return "Keldeo";
  case 648:
    return "Meloetta";
  case 649:
    return "Genesect";
  }
}

var statMod = {
  Get: function (Mon, Stat) { //like modded in the games, except no +/-6 limit
    if (Mon.Mod[Stat] >= 0) {
      return (Mon.Mod[Stat] + 2) / 2;
    } else {
      return 2 / (-Mon.Mod[Stat] + 2);
    }
  },
  Set: {
    Absolute: function (Mon, stat, i) {
      switch (stat) {
      case 0:
        Mon.Atk += i;
        sStat = "ATK";
        break;
      case 1:
        Mon.Def += i;
        sStat = "DEF";
        break;
      case 2:
        Mon.Spe += i;
        sStat = "SPE";
        break;
      case 3:
        Mon.Spc += i;
        sStat = "SPC";
        break;
      }
      if (i < 0) {
        i = -i;
        sendMsg(obTrans.GetMessages().GetString("StatAbsDecr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
      } else if (i > 0) {
        sendMsg(obTrans.GetMessages().GetString("StatAbsIncr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
      }
    },
    Relative: function (Mon, stat, i) {
      switch (stat) {
      case 0:
        Mon.Mod[0] += i;
        sStat = "ATK";
        break;
      case 1:
        Mon.Mod[1] += i;
        sStat = "DEF";
        break;
      case 2:
        Mon.Mod[2] += i;
        sStat = "SPE";
        break;
      case 3:
        Mon.Mod[3] += i;
        sStat = "SPC";
        break;
      }
      if (i < 0) {
        i = -i;
        sendMsg(obTrans.GetMessages().GetString("StatRelDecr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
      } else if (i > 0) {
        sendMsg(obTrans.GetMessages().GetString("StatRelIncr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
      }
    },
    Percent: function (Mon, stat, i) {
      switch (stat) {
      case 0:
        Mon.Atk += Math.floor(Mon.Atk * i / 100);
        sStat = "ATK";
        break;
      case 1:
        Mon.Def += Math.floor(Mon.Def * i / 100);
        sStat = "DEF";
        break;
      case 2:
        Mon.Spe += Math.floor(Mon.Spe * i / 100);
        sStat = "SPE";
        break;
      case 3:
        Mon.Spc += Math.floor(Mon.Spc * i / 100);
        sStat = "SPC";
        break;
      }
      if (i < 0) {
        i = -i;
        sendMsg(obTrans.GetMessages().GetString("StatPerDecr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
      } else if (i > 0) {
        sendMsg(obTrans.GetMessages().GetString("StatPerIncr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
      }
    }
  }
};

var status = {
  Set: function (Mon, ID) {
    if (Mon.Status.ID === -1) {
      if (Mon.Equip.Eff.match("i" + ID) !== null || Mon.Equip.Eff.match("i-1") !== null) {
        sendMsg(obTrans.GetMessages().GetString("StsImmune").replace(/MON_NAME/, Mon.Name));
      } else {
        sendMsg(obTrans.GetMessages().GetString("StsGive" + ID).replace(/MON_NAME/, Mon.Name));
        Mon.Status.ID = ID;
      }
    }
  },
  StartCheck: function (Mon) {
    if (Mon.Status.Recharge === 1) {
      sendMsg(obTrans.GetMessages().GetString("MustRecharge").replace(/MON_NAME/, Mon.Name));
      return 0;
    }
    if (Mon.Status.ID > -1) {
      switch (Mon.Status.ID) {
      case 0:
        //Sleeping
        if (rand() < 0.5) {
          sendMsg(obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
          return 0;
        } else {
          sendMsg(obTrans.GetMessages().GetString("StsChkCure" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
          Mon.Status.ID = -1;
          return 1;
        }
      case 3:
        //Paralyzed
        if (rand() < 0.5) {
          sendMsg(obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
          return 0;
        } else {
          sendMsg(obTrans.GetMessages().GetString("StsChkCure" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
          Mon.Status.ID = -1;
          return 1;
        }
      case 4:
        //Frozen
        if (rand() < 0.5) {
          sendMsg(obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
          return 0;
        } else {
          sendMsg(obTrans.GetMessages().GetString("StsChkCure" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
          Mon.Status.ID = -1;
          return 1;
        }
      case 5:
        //Confused
        if (rand() < 0.5) {
          Mon.HPCur -= Math.floor(Mon.HPMax / 16);
          sendMsg(obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
          displayHP(Mon);
          return 0;
        } else {
          sendMsg(obTrans.GetMessages().GetString("StsChkCure" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
          Mon.Status.ID = -1;
          return 1;
        }
      case 6:
        //Infatuated
        if (rand() < .3333) {
          sendMsg(obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
          return 0;
        } else {
          return 1;
        }
      default:
        return 1;
      }
    }
    return 1;
  },
  EndCheck: function (Mon) {
    if (Mon.Status.ID > -1) {
      switch (Mon.Status.ID) {
      case 1:
        Mon.HPCur -= Math.floor(Mon.HPMax / 16);
        sendMsg(obTrans.GetMessages().GetString("StsEndBrn").replace(/MON_NAME/, Mon.Name));
        displayHP(Mon);
        break;
      case 2:
        Mon.HPCur -= Math.floor(Mon.HPMax / 16);
        sendMsg(obTrans.GetMessages().GetString("StsEndPsn").replace(/MON_NAME/, Mon.Name));
        displayHP(Mon);
        break;
      }
    }
  }
};


function PokemonTypes(Name) {
  switch (Name) {
  case "BULBASAUR":
    return [4, 7];
  case "IVYSAUR":
    return [4, 7];
  case "VENUSAUR":
    return [4, 7];
  case "CHARMANDER":
    return [1];
  case "CHARMELEON":
    return [1];
  case "CHARIZARD":
    return [1, 9];
  case "SQUIRTLE":
    return [2];
  case "WARTORTLE":
    return [2];
  case "BLASTOISE":
    return [2];
  case "CATERPIE":
    return [11];
  case "METAPOD":
    return [11];
  case "BUTTERFREE":
    return [11, 9];
  case "WEEDLE":
    return [11, 7];
  case "KAKUNA":
    return [11, 7];
  case "BEEDRILL":
    return [11, 7];
  case "PIDGEY":
    return [0, 9];
  case "PIDGEOTTO":
    return [0, 9];
  case "PIDGEOT":
    return [0, 9];
  case "RATTATA":
    return [0];
  case "RATICATE":
    return [0];
  case "SPEAROW":
    return [0, 9];
  case "FEAROW":
    return [0, 9];
  case "EKANS":
    return [7];
  case "ARBOK":
    return [7];
  case "PIKACHU":
    return [3];
  case "RAICHU":
    return [3];
  case "SANDSHREW":
    return [8];
  case "SANDSLASH":
    return [8];
  case "NIDORAN":
    return [7];
  case "NIDORINA":
    return [7];
  case "NIDOQUEEN":
    return [7, 8];
  case "NIDORINO":
    return [7];
  case "NIDOKING":
    return [7, 8];
  case "CLEFAIRY":
    return [0];
  case "CLEFABLE":
    return [0];
  case "VULPIX":
    return [1];
  case "NINETALES":
    return [1];
  case "JIGGLYPUFF":
    return [0];
  case "WIGGLYTUFF":
    return [0];
  case "ZUBAT":
    return [7, 9];
  case "GOLBAT":
    return [7, 9];
  case "ODDISH":
    return [4, 7];
  case "GLOOM":
    return [4, 7];
  case "VILEPLUME":
    return [4, 7];
  case "PARAS":
    return [11, 4];
  case "PARASECT":
    return [11, 4];
  case "VENONAT":
    return [11, 7];
  case "VENOMOTH":
    return [11, 7];
  case "DIGLETT":
    return [8];
  case "DUGTRIO":
    return [8];
  case "MEOWTH":
    return [0];
  case "PERSIAN":
    return [0];
  case "PSYDUCK":
    return [2];
  case "GOLDUCK":
    return [2];
  case "MANKEY":
    return [6];
  case "PRIMEAPE":
    return [6];
  case "GROWLITHE":
    return [1];
  case "ARCANINE":
    return [1];
  case "POLIWAG":
    return [2];
  case "POLIWHIRL":
    return [2];
  case "POLIWRATH":
    return [2, 6];
  case "ABRA":
    return [10];
  case "KADABRA":
    return [10];
  case "ALAKAZAM":
    return [10];
  case "MACHOP":
    return [6];
  case "MACHOKE":
    return [6];
  case "MACHAMP":
    return [6];
  case "BELLSPROUT":
    return [4, 7];
  case "WEEPINBELL":
    return [4, 7];
  case "VICTREEBEL":
    return [4, 7];
  case "TENTACOOL":
    return [2, 7];
  case "TENTACRUEL":
    return [2, 7];
  case "GEODUDE":
    return [12, 8];
  case "GRAVELER":
    return [12, 8];
  case "GOLEM":
    return [12, 8];
  case "PONYTA":
    return [1];
  case "RAPIDASH":
    return [1];
  case "SLOWPOKE":
    return [2, 10];
  case "SLOWBRO":
    return [2, 10];
  case "MAGNEMITE":
    return [3, 16];
  case "MAGNETON":
    return [3, 16];
  case "FARFETCH'D":
    return [9, 0];
  case "DODUO":
    return [0, 9];
  case "DODRIO":
    return [0, 9];
  case "SEEL":
    return [2];
  case "DEWGONG":
    return [2, 5];
  case "GRIMER":
    return [7];
  case "MUK":
    return [7];
  case "SHELLDER":
    return [2];
  case "CLOYSTER":
    return [2, 5];
  case "GASTLY":
    return [13, 7];
  case "HAUNTER":
    return [13, 7];
  case "GENGAR":
    return [13, 7];
  case "ONIX":
    return [12, 8];
  case "DROWZEE":
    return [10];
  case "HYPNO":
    return [10];
  case "KRABBY":
    return [2];
  case "KINGLER":
    return [2];
  case "VOLTORB":
    return [3];
  case "ELECTRODE":
    return [3];
  case "EXEGGCUTE":
    return [4, 10];
  case "EXEGGUTOR":
    return [4, 10];
  case "CUBONE":
    return [8];
  case "MAROWAK":
    return [8];
  case "HITMONLEE":
    return [6];
  case "HITMONCHAN":
    return [6];
  case "LICKITUNG":
    return [0];
  case "KOFFING":
    return [7];
  case "WEEZING":
    return [7];
  case "RHYHORN":
    return [8, 12];
  case "RHYDON":
    return [8, 12];
  case "CHANSEY":
    return [0];
  case "TANGELA":
    return [4];
  case "KANGASKHAN":
    return [0];
  case "HORSEA":
    return [2];
  case "SEADRA":
    return [2];
  case "GOLDEEN":
    return [2];
  case "SEAKING":
    return [2];
  case "STARYU":
    return [2];
  case "STARMIE":
    return [2, 10];
  case "MR. MIME":
    return [10];
  case "SCYTHER":
    return [11, 9];
  case "JYNX":
    return [5, 10];
  case "ELECTABUZZ":
    return [3];
  case "MAGMAR":
    return [1];
  case "PINSIR":
    return [11];
  case "TAUROS":
    return [0];
  case "MAGIKARP":
    return [2];
  case "GYARADOS":
    return [2, 9];
  case "LAPRAS":
    return [2, 5];
  case "DITTO":
    return [0];
  case "EEVEE":
    return [0];
  case "VAPOREON":
    return [2];
  case "JOLTEON":
    return [3];
  case "FLAREON":
    return [1];
  case "PORYGON":
    return [0];
  case "OMANYTE":
    return [12, 2];
  case "OMASTAR":
    return [12, 2];
  case "KABUTO":
    return [12, 2];
  case "KABUTOPS":
    return [12, 2];
  case "AERODACTYL":
    return [12, 9];
  case "SNORLAX":
    return [0];
  case "ARTICUNO":
    return [5, 9];
  case "ZAPDOS":
    return [3, 9];
  case "MOLTRES":
    return [1, 9];
  case "DRATINI":
    return [14];
  case "DRAGONAIR":
    return [14];
  case "DRAGONITE":
    return [14, 9];
  case "MEWTWO":
    return [10];
  case "MEW":
    return [10];
    //JOHTO
  case "CHIKORITA":
    return [4];
  case "BAYLEEF":
    return [4];
  case "MEGANIUM":
    return [4];
  case "CYNDAQUIL":
    return [1];
  case "QUILAVA":
    return [1];
  case "TYPHLOSION":
    return [1];
  case "TOTODILE":
    return [2];
  case "CROCONAW":
    return [2];
  case "FERALIGATR":
    return [2];
  case "SENTRET":
    return [0];
  case "FURRET":
    return [0];
  case "HOOTHOOT":
    return [0, 9];
  case "NOCTOWL":
    return [0, 9];
  case "LEDYBA":
    return [11, 9];
  case "LEDIAN":
    return [11, 9];
  case "SPINARAK":
    return [11, 7];
  case "ARIADOS":
    return [11, 7];
  case "CROBAT":
    return [7, 9];
  case "CHINCHOU":
    return [2, 3];
  case "LANTURN":
    return [2, 3];
  case "PICHU":
    return [3];
  case "CLEFFA":
    return [0];
  case "IGGLYBUFF":
    return [0];
  case "TOGEPI":
    return [0];
  case "TOGETIC":
    return [0, 9];
  case "NATU":
    return [10, 9];
  case "XATU":
    return [10, 9];
  case "MAREEP":
    return [3];
  case "FLAAFFY":
    return [3];
  case "AMPHAROS":
    return [3];
  case "BELLOSSOM":
    return [4];
  case "MARILL":
    return [2];
  case "AZUMARILL":
    return [2];
  case "SUDOWOODO":
    return [12];
  case "POLITOED":
    return [2];
  case "HOPPIP":
    return [4, 9];
  case "SKIPLOOM":
    return [4, 9];
  case "JUMPLUFF":
    return [4, 9];
  case "AIPOM":
    return [0];
  case "SUNKERN":
    return [4];
  case "SUNFLORA":
    return [4];
  case "YANMA":
    return [11, 9];
  case "WOOPER":
    return [2, 8];
  case "QUAGSIRE":
    return [2, 8];
  case "ESPEON":
    return [10];
  case "UMBREON":
    return [15];
  case "MURKROW":
    return [15, 9];
  case "SLOWKING":
    return [2, 10];
  case "MISDREAVUS":
    return [13];
  case "UNOWN":
    return [10];
  case "WOBBUFFET":
    return [10];
  case "GIRAFARIG":
    return [0, 10];
  case "PINECO":
    return [11];
  case "FORRETRESS":
    return [11, 16];
  case "DUNSPARCE":
    return [0];
  case "GLIGAR":
    return [8, 9];
  case "STEELIX":
    return [16, 8];
  case "SNUBBULL":
    return [0];
  case "GRANBULL":
    return [0];
  case "QWILFISH":
    return [2, 7];
  case "SCIZOR":
    return [11, 16];
  case "SHUCKLE":
    return [11, 12];
  case "HERACROSS":
    return [11, 6];
  case "SNEASEL":
    return [15, 5];
  case "TEDDIURSA":
    return [0];
  case "URSARING":
    return [0];
  case "SLUGMA":
    return [1];
  case "MAGCARGO":
    return [1, 12];
  case "SWINUB":
    return [5, 8];
  case "PILOSWINE":
    return [5, 8];
  case "CORSOLA":
    return [2, 12];
  case "REMORAID":
    return [2];
  case "OCTILLERY":
    return [2];
  case "DELIBIRD":
    return [5, 9];
  case "MANTINE":
    return [2, 9];
  case "SKARMORY":
    return [16, 9];
  case "HOUNDOUR":
    return [15, 1];
  case "HOUNDOOM":
    return [15, 1];
  case "KINGDRA":
    return [2, 14];
  case "PHANPY":
    return [8];
  case "DONPHAN":
    return [8];
  case "PORYGON2":
    return [0];
  case "STANTLER":
    return [0];
  case "SMEARGLE":
    return [0];
  case "TYROGUE":
    return [6];
  case "HITMONTOP":
    return [6];
  case "SMOOCHUM":
    return [5, 10];
  case "ELEKID":
    return [3];
  case "MAGBY":
    return [1];
  case "MILTANK":
    return [0];
  case "BLISSEY":
    return [0];
  case "RAIKOU":
    return [3];
  case "ENTEI":
    return [1];
  case "SUICUNE":
    return [2];
  case "LARVITAR":
    return [12, 8];
  case "PUPITAR":
    return [12, 8];
  case "TYRANITAR":
    return [12, 15];
  case "LUGIA":
    return [10, 9];
  case "HO-OH":
    return [1, 9];
  case "CELEBI":
    return [10, 4];
    //HOENN
  case "TREECKO":
    return [4];
  case "GROVYLE":
    return [4];
  case "SCEPTILE":
    return [4];
  case "TORCHIC":
    return [1];
  case "COMBUSKEN":
    return [1, 6];
  case "BLAZIKEN":
    return [1, 6];
  case "MUDKIP":
    return [2];
  case "MARSHTOMP":
    return [2, 8];
  case "SWAMPERT":
    return [2, 8];
  case "POOCHYENA":
    return [15];
  case "MIGHTYENA":
    return [15];
  case "ZIGZAGOON":
    return [0];
  case "LINOONE":
    return [0];
  case "WURMPLE":
    return [11];
  case "SILCOON":
    return [11];
  case "BEAUTIFLY":
    return [11, 9];
  case "CASCOON":
    return [11];
  case "DUSTOX":
    return [11, 7];
  case "LOTAD":
    return [2, 4];
  case "LOMBRE":
    return [2, 4];
  case "LUDICOLO":
    return [2, 4];
  case "SEEDOT":
    return [4];
  case "NUZLEAF":
    return [4, 15];
  case "SHIFTRY":
    return [4, 15];
  case "TAILLOW":
    return [0, 9];
  case "SWELLOW":
    return [0, 9];
  case "WINGULL":
    return [2, 9];
  case "PELIPPER":
    return [2, 9];
  case "RALTS":
    return [10];
  case "KIRLIA":
    return [10];
  case "GARDEVOIR":
    return [10];
  case "SURSKIT":
    return [11, 2];
  case "MASQUERAIN":
    return [11, 9];
  case "SHROOMISH":
    return [4];
  case "BRELOOM":
    return [4, 6];
  case "SLAKOTH":
    return [0];
  case "VIGOROTH":
    return [0];
  case "SLAKING":
    return [0];
  case "NINCADA":
    return [11, 8];
  case "NINJASK":
    return [11, 9];
  case "SHEDINJA":
    return [11, 13];
  case "WHISMUR":
    return [0];
  case "LOUDRED":
    return [0];
  case "EXPLOUD":
    return [0];
  case "MAKUHITA":
    return [6];
  case "HARIYAMA":
    return [6];
  case "AZURILL":
    return [0];
  case "NOSEPASS":
    return [12];
  case "SKITTY":
    return [0];
  case "DELCATTY":
    return [0];
  case "SABLEYE":
    return [15, 13];
  case "MAWILE":
    return [16];
  case "ARON":
    return [16, 12];
  case "LAIRON":
    return [16, 12];
  case "AGGRON":
    return [16, 12];
  case "MEDITITE":
    return [6, 10];
  case "MEDICHAM":
    return [6, 10];
  case "ELECTRIKE":
    return [3];
  case "MANECTRIC":
    return [3];
  case "PLUSLE":
    return [3];
  case "MINUN":
    return [3];
  case "VOLBEAT":
    return [11];
  case "ILLUMISE":
    return [11];
  case "ROSELIA":
    return [4, 7];
  case "GULPIN":
    return [7];
  case "SWALOT":
    return [7];
  case "CARVANHA":
    return [2];
  case "SHARPEDO":
    return [2];
  case "WAILMER":
    return [2];
  case "WAILORD":
    return [2];
  case "NUMEL":
    return [1, 8];
  case "CAMERUPT":
    return [1, 8];
  case "TORKOAL":
    return [1];
  case "SPOINK":
    return [10];
  case "GRUMPIG":
    return [10];
  case "SPINDA":
    return [0];
  case "TRAPINCH":
    return [8];
  case "VIBRAVA":
    return [8, 14];
  case "FLYGON":
    return [8, 14];
  case "CACNEA":
    return [4];
  case "CACTURNE":
    return [4, 15];
  case "SWABLU":
    return [0, 9];
  case "ALTARIA":
    return [14, 9];
  case "ZANGOOSE":
    return [0];
  case "SEVIPER":
    return [7];
  case "LUNATONE":
    return [12, 10];
  case "SOLROCK":
    return [12, 10];
  case "BARBOACH":
    return [2, 8];
  case "WHISCASH":
    return [2, 8];
  case "CORPHISH":
    return [2];
  case "CRAWDAUNT":
    return [2, 15];
  case "BALTOY":
    return [8, 10];
  case "CLAYDOL":
    return [8, 10];
  case "LILEEP":
    return [12, 4];
  case "CRADILY":
    return [12, 4];
  case "ANORITH":
    return [12, 11];
  case "ARMALDO":
    return [12, 11];
  case "FEEBAS":
    return [2];
  case "MILOTIC":
    return [2];
  case "CASTFORM":
    return [0];
  case "KECLEON":
    return [0];
  case "SHUPPET":
    return [13];
  case "BANETTE":
    return [13];
  case "DUSKULL":
    return [13];
  case "DUSCLOPS":
    return [13];
  case "TROPIUS":
    return [4, 9];
  case "CHIMECHO":
    return [10];
  case "ABSOL":
    return [15];
  case "WYNAUT":
    return [10];
  case "SNORUNT":
    return [5];
  case "GLALIE":
    return [5];
  case "SPHEAL":
    return [5, 2];
  case "SEALEO":
    return [5, 2];
  case "WALREIN":
    return [5, 2];
  case "CLAMPERL":
    return [2];
  case "HUNTAIL":
    return [2];
  case "GOREBYSS":
    return [2];
  case "RELICANTH":
    return [2, 12];
  case "LUVDISC":
    return [2];
  case "BAGON":
    return [14];
  case "SHELGON":
    return [14];
  case "SALAMENCE":
    return [14, 9];
  case "BELDUM":
    return [16, 10];
  case "METANG":
    return [16, 10];
  case "METAGROSS":
    return [16, 10];
  case "REGIROCK":
    return [12];
  case "REGICE":
    return [5];
  case "REGISTEEL":
    return [16];
  case "LATIAS":
    return [10, 14];
  case "LATIOS":
    return [10, 14];
  case "KYOGRE":
    return [2];
  case "GROUDON":
    return [8];
  case "RAYQUAZA":
    return [14, 9];
  case "JIRACHI":
    return [16, 10];
  case "DEOXYS":
    return [10];
    //SINNOH
  case "TURTWIG":
    return [4];
  case "GROTLE":
    return [4];
  case "TORTERRA":
    return [4, 8];
  case "CHIMCHAR":
    return [1];
  case "MONFERNO":
    return [1, 6];
  case "INFERNAPE":
    return [1, 6];
  case "PIPLUP":
    return [2];
  case "PRINPLUP":
    return [2];
  case "EMPOLEON":
    return [2, 16];
  case "STARLY":
    return [0, 9];
  case "STARAVIA":
    return [0, 9];
  case "STARAPTOR":
    return [0, 9];
  case "BIDOOF":
    return [0];
  case "BIBAREL":
    return [0, 2];
  case "KRICKETOT":
    return [11];
  case "KRICKETUNE":
    return [11];
  case "SHINX":
    return [3];
  case "LUXIO":
    return [3];
  case "LUXRAY":
    return [3];
  case "BUDEW":
    return [4, 7];
  case "ROSERADE":
    return [4, 7];
  case "CRANIDOS":
    return [12];
  case "RAMPARDOS":
    return [12];
  case "SHIELDON":
    return [12, 16];
  case "BASTIODON":
    return [12, 16];
  case "BURMY":
    return [11];
  case "WORMADAM":
    return [11];
  case "MOTHIM":
    return [11, 9];
  case "COMBEE":
    return [11, 9];
  case "VESPIQUEN":
    return [11, 9];
  case "PACHIRISU":
    return [3];
  case "BUIZEL":
    return [2];
  case "FLOATZEL":
    return [2];
  case "CHERUBI":
    return [4];
  case "CHERRIM":
    return [4];
  case "SHELLOS":
    return [2];
  case "GASTRODON":
    return [2, 8];
  case "AMBIPOM":
    return [0];
  case "DRIFLOON":
    return [13, 9];
  case "DRIFBLIM":
    return [13, 9];
  case "BUNEARY":
    return [0];
  case "LOPUNNY":
    return [0];
  case "MISMAGIUS":
    return [13];
  case "HONCHKROW":
    return [15, 9];
  case "GLAMEOW":
    return [0];
  case "PURUGLY":
    return [0];
  case "CHINGLING":
    return [10];
  case "STUNKY":
    return [7, 15];
  case "SKUNTANK":
    return [7, 15];
  case "BRONZOR":
    return [16, 10];
  case "BRONZONG":
    return [16, 10];
  case "BONSLY":
    return [12];
  case "MIME JR.":
    return [10];
  case "HAPPINY":
    return [0];
  case "CHATOT":
    return [0, 9];
  case "SPIRITOMB":
    return [15, 13];
  case "GIBLE":
    return [14, 8];
  case "GABITE":
    return [14, 8];
  case "GARCHOMP":
    return [14, 8];
  case "MUNCHLAX":
    return [0];
  case "RIOLU":
    return [6];
  case "LUCARIO":
    return [6, 16];
  case "HIPPOPOTAS":
    return [8];
  case "HIPPOWDON":
    return [8];
  case "SKORUPI":
    return [7, 11];
  case "DRAPION":
    return [7, 15];
  case "CROAGUNK":
    return [7, 6];
  case "TOXICROAK":
    return [7, 6];
  case "CARNIVINE":
    return [4];
  case "FINNEON":
    return [2];
  case "LUMINEON":
    return [2];
  case "MANTYKE":
    return [9, 2];
  case "SNOVER":
    return [5, 4];
  case "ABOMASNOW":
    return [5, 4];
  case "WEAVILE":
    return [5, 15];
  case "MAGNEZONE":
    return [3, 16];
  case "LICKILICKY":
    return [0];
  case "RHYPERIOR":
    return [8, 12];
  case "TANGROWTH":
    return [4];
  case "ELECTIVIRE":
    return [3];
  case "MAGMORTAR":
    return [1];
  case "TOGEKISS":
    return [0, 9];
  case "YANMEGA":
    return [11, 9];
  case "LEAFEON":
    return [4];
  case "GLACEON":
    return [5];
  case "GLISCOR":
    return [8, 9];
  case "MAMOSWINE":
    return [8, 5];
  case "PORYGON-Z":
    return [0];
  case "GALLADE":
    return [10, 6];
  case "PROBOPASS":
    return [12, 16];
  case "DUSKNOIR":
    return [13];
  case "FROSLASS":
    return [13, 5];
  case "ROTOM":
    return [13, 3];
  case "UXIE":
    return [10];
  case "MESPRIT":
    return [10];
  case "AZELF":
    return [10];
  case "DIALGA":
    return [14, 16];
  case "PALKIA":
    return [14, 2];
  case "HEATRAN":
    return [1, 16];
  case "REGIGIGAS":
    return [0];
  case "GIRATINA":
    return [13, 14];
  case "CRESSELIA":
    return [10];
  case "PHIONE":
    return [2];
  case "MANAPHY":
    return [2];
  case "DARKRAI":
    return [15];
  case "SHAYMIN":
    return [4];
    //UNOVA
  case "VICTINI":
    return [10, 1];
  case "SNIVY":
    return [4];
  case "SERVINE":
    return [4];
  case "SERPERIOR":
    return [4];
  case "TEPIG":
    return [1];
  case "PIGNITE":
    return [1, 6];
  case "EMBOAR":
    return [1, 6];
  case "OSHAWOTT":
    return [2];
  case "DEWOTT":
    return [2];
  case "SAMUROTT":
    return [2];
  case "PATRAT":
    return [0];
  case "WATCHOG":
    return [0];
  case "LILLIPUP":
    return [0];
  case "HERDIER":
    return [0];
  case "STOUTLAND":
    return [0];
  case "PURRLOIN":
    return [15];
  case "LIEPARD":
    return [15];
  case "PANSAGE":
    return [4];
  case "SIMISAGE":
    return [4];
  case "PANSEAR":
    return [1];
  case "SIMISEAR":
    return [1];
  case "PANPOUR":
    return [2];
  case "SIMIPOUR":
    return [2];
  case "MUNNA":
    return [10];
  case "MUSHARNA":
    return [10];
  case "PIDOVE":
    return [0, 9];
  case "TRANQUILL":
    return [0, 9];
  case "UNFEZANT":
    return [0, 9];
  case "BLITZLE":
    return [3];
  case "ZEBSTRIKA":
    return [3];
  case "ROGGENROLA":
    return [12];
  case "BOLDORE":
    return [12];
  case "GIGALITH":
    return [12];
  case "WOOBAT":
    return [10, 9];
  case "SWOOBAT":
    return [10, 9];
  case "DRILBUR":
    return [8];
  case "EXCADRILL":
    return [8, 16];
  case "AUDINO":
    return [0];
  case "TIMBURR":
    return [6];
  case "GURDURR":
    return [6];
  case "CONKELDURR":
    return [6];
  case "TYMPOLE":
    return [2];
  case "PALPITOAD":
    return [2, 8];
  case "SEISMITOAD":
    return [2, 8];
  case "THROH":
    return [6];
  case "SAWK":
    return [6];
  case "SEWADDLE":
    return [11, 4];
  case "SWADLOON":
    return [11, 4];
  case "LEAVANNY":
    return [11, 4];
  case "VENIPEDE":
    return [11, 7];
  case "WHIRLIPEDE":
    return [11, 7];
  case "SCOLIPEDE":
    return [11, 7];
  case "COTTONEE":
    return [4];
  case "WHIMSICOTT":
    return [4];
  case "PETILIL":
    return [4];
  case "LILLIGANT":
    return [4];
  case "BASCULIN":
    return [2];
  case "SANDILE":
    return [8, 15];
  case "KROKOROK":
    return [8, 15];
  case "KROOKODILE":
    return [8, 15];
  case "DARUMAKA":
    return [1];
  case "DARMANITAN":
    return [1];
  case "MARACTUS":
    return [4];
  case "DWEBBLE":
    return [11, 12];
  case "CRUSTLE":
    return [11, 12];
  case "SCRAGGY":
    return [15, 6];
  case "SCRAFTY":
    return [15, 6];
  case "SIGILYPH":
    return [10, 9];
  case "YAMASK":
    return [13];
  case "COFAGRIGUS":
    return [13];
  case "TIRTOUGA":
    return [2, 12];
  case "CARRACOSTA":
    return [2, 12];
  case "ARCHEN":
    return [12, 9];
  case "ARCHEOPS":
    return [12, 9];
  case "TRUBBISH":
    return [7];
  case "GARBODOR":
    return [7];
  case "ZORUA":
    return [15];
  case "ZOROARK":
    return [15];
  case "MINCCINO":
    return [0];
  case "CINCCINO":
    return [0];
  case "GOTHITA":
    return [10];
  case "GOTHORITA":
    return [10];
  case "GOTHITELLE":
    return [10];
  case "SOLOSIS":
    return [10];
  case "DUOSION":
    return [10];
  case "REUNICLUS":
    return [10];
  case "DUCKLETT":
    return [2, 9];
  case "SWANNA":
    return [2, 9];
  case "VANILLITE":
    return [5];
  case "VANILLISH":
    return [5];
  case "VANILLUXE":
    return [5];
  case "DEERLING":
    return [0, 4];
  case "SAWSBUCK":
    return [0, 4];
  case "EMOLGA":
    return [3, 9];
  case "KARRABLAST":
    return [11];
  case "ESCAVALIER":
    return [11, 16];
  case "FOONGUS":
    return [4, 7];
  case "AMOONGUSS":
    return [4, 7];
  case "FRILLISH":
    return [2, 13];
  case "JELLICENT":
    return [2, 13];
  case "ALOMOMOLA":
    return [2];
  case "JOLTIK":
    return [11, 3];
  case "GALVANTULA":
    return [11, 3];
  case "FERROSEED":
    return [4, 16];
  case "FERROTHORN":
    return [4, 16];
  case "KLINK":
    return [16];
  case "KLANG":
    return [16];
  case "KLINKLANG":
    return [16];
  case "TYNAMO":
    return [3];
  case "EELEKTRIK":
    return [3];
  case "EELEKTROSS":
    return [3];
  case "ELGYEM":
    return [10];
  case "BEHEEYEM":
    return [10];
  case "LITWICK":
    return [13, 1];
  case "LAMPENT":
    return [13, 1];
  case "CHANDELURE":
    return [13, 1];
  case "AXEW":
    return [14];
  case "FRAXURE":
    return [14];
  case "HAXORUS":
    return [14];
  case "CUBCHOO":
    return [5];
  case "BEARTIC":
    return [5];
  case "CRYOGONAL":
    return [5];
  case "SHELMET":
    return [11];
  case "ACCELGOR":
    return [11];
  case "STUNFISK":
    return [8, 3];
  case "MIENFOO":
    return [6];
  case "MIENSHAO":
    return [6];
  case "DRUDDIGON":
    return [14];
  case "GOLETT":
    return [8, 13];
  case "GOLURK":
    return [8, 13];
  case "PAWNIARD":
    return [15, 16];
  case "BISHARP":
    return [15, 16];
  case "BOUFFALANT":
    return [0];
  case "RUFFLET":
    return [0, 9];
  case "BRAVIARY":
    return [0, 9];
  case "VULLABY":
    return [15, 9];
  case "MANDIBUZZ":
    return [15, 9];
  case "HEATMOR":
    return [1];
  case "DURANT":
    return [11, 16];
  case "DEINO":
    return [15, 14];
  case "ZWEILOUS":
    return [15, 14];
  case "HYDREIGON":
    return [15, 14];
  case "LARVESTA":
    return [11, 1];
  case "VOLCARONA":
    return [11, 1];
  case "COBALION":
    return [16, 6];
  case "TERRAKION":
    return [12, 6];
  case "VIRIZION":
    return [4, 6];
  case "TORNADUS":
    return [9];
  case "THUNDURUS":
    return [3, 9];
  case "RESHIRAM":
    return [14, 1];
  case "ZEKROM":
    return [14, 3];
  case "LANDORUS":
    return [8, 9];
  case "KYUREM":
    return [14, 5];
  case "KELDEO":
    return [2, 6];
  case "MELOETTA":
    return [0, 10];
  case "GENESECT":
    return [11, 16];
  case "ARCEUS":
    return [Math.floor(rand() * 17)];
  default:
    if (obConf.Pref.mustBePokemonOn === true) {
      return -1;
    } else {
      if (rand() > .5) {
        type0 = Math.floor(rand() * 17);
        type1 = Math.floor(rand() * 17);
        while (type0 === type1) {
          type1 = Math.floor(rand() * 17);
        }
        return [type0, type1];
      } else {
        return [Math.floor(rand() * 17)];
      }
    }
  }
}



CHEAT = 0;
rand = null;
bWnd = [];
iWnd = 0;
msgCrit = "";
msgEffect = "";

/*
obTrans = {};
obConf = {};
obCmds = {};
obMoveDB = {};
obMonParty = {};
obEquipDB = {};
obItemDB = {};
*/

aTypeMatchup = [
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, .5, 2, 1, .5, .5, 1, 1, 2, 1, 1, .5, 2, 1, 1, 1, .5],
  [1, .5, .5, 2, 2, .5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, .5],
  [1, 1, 1, .5, 1, 1, 1, 1, 2, .5, 1, 1, 1, 1, 1, 1, .5],
  [1, 2, .5, .5, .5, 2, 1, 2, .5, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 1, 1, 1, .5, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, .5, .5, 1, 1, .5, 1],
  [1, 1, 1, 1, .5, 1, .5, .5, 2, 1, 2, .5, 1, 1, 1, 1, 1],
  [1, 1, 2, 0, 2, 2, 1, .5, 1, 1, 1, 1, .5, 1, 1, 1, 1],
  [1, 1, 1, 2, .5, 2, .5, 1, 0, 1, 1, .5, 2, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, .5, 1, 1, 1, .5, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 1, .5, 1, .5, 1, .5, 2, 1, 1, 2, 1, 1, 1, 1],
  [.5, .5, 2, 1, 2, 1, 2, .5, 2, .5, 1, 1, 1, 1, 1, 1, 2],
  [0, 1, 1, 1, 1, 1, 0, .5, 1, 1, 1, .5, 1, 2, 1, 2, 1],
  [1, .5, .5, .5, .5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 2, 1, .5, 1, .5, 1],
  [.5, 2, 1, 1, .5, .5, 2, 0, 2, .5, .5, .5, .5, .5, .5, .5, .5]
];

function OnWndAboutEvent_CtrlClicked(aboutWnd, ControlId) {
  switch (ControlId) {
  case "SiteLink":
    openPage("http://apotah.zxq.net/battler/");
    break;
  }
}

function openPage(sLink) {
  console.log("Unsupported function openPage");
}

function loadCmdWnd(cmdWnd) {
  //Remove current list items
  for (var i = cmdWnd.LstView_GetCount("LvCommands") - 1; i >= 0; i--) {
    cmdWnd.LstView_RemoveItem("LvCommands", i);
  }
  //(Re)populate list
  var i = 0;
  var a = ["ichal", "go", "bhelp", "qq", "return", "use", "heal", "item", "equip", "unequip"];
  for (var p in obCmds) {
    cmdWnd.LstView_AddItem("LvCommands", p);
    cmdWnd.LstView_SetItemText("LvCommands", i, 1, a[i]);
    cmdWnd.LstView_SetItemText("LvCommands", i, 2, obCmds[p]);
    i++;
  }
}

function OnWndCommandsEvent_CtrlClicked(PlusWnd, ControlId) {
  switch (ControlId) {
  case "BtnEdit":
    //Loop through the list to find the selected item
    for (i = 0; i < PlusWnd.LstView_GetCount("LvCommands"); i++) {
      if (PlusWnd.LstView_GetSelectedState("LvCommands", i) === true) {
        loadEditCmdWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditCmd"), PlusWnd.LstView_GetItemText("LvCommands", i, 0), PlusWnd.LstView_GetItemText("LvCommands", i, 1), PlusWnd.LstView_GetItemText("LvCommands", i, 2));
      }
    }
    break;
  }
}

function OnWndCommandsEvent_LstViewDblClicked(PlusWnd, ControlId, ItemIdx) {
  loadEditCmdWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditCmd"), PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0), PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 1), PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 2));
}

function loadEditCmdWnd(PlusWnd, sCommand, sDefault, sCustom) {
  PlusWnd.SetControlText("EdtCmd", sCommand);
  PlusWnd.SetControlText("EdtDefault", sDefault);
  PlusWnd.SetControlText("EdtCustom", sCustom);
}

function OnWndEditCmdEvent_CtrlClicked(PlusWnd, ControlId) {
  switch (ControlId) {
  case "BtnConfirm":
    var sCustom = sanitizeStr(PlusWnd.GetControlText("EdtCustom")).toLowerCase();
    if (sCustom !== "") {
      iniIntf.WriteIni("settings", "Commands", PlusWnd.GetControlText("EdtCmd"), sCustom);
    }
    PlusWnd.Close(1);
    settings.LoadFile.Cmd();
    loadCmdWnd(cmdWnd);
    break;
  }
}

function OnWndConfigEvent_CtrlClicked(confWnd, ControlId) {
  switch (ControlId) {
  case "BtnSave":
    saveConfig(confWnd);
    //confWnd.Close(1);
    break;
  case "BtnDefault":
    confWnd.Button_SetCheckState("ChkHeal", true);
    confWnd.Button_SetCheckState("ChkQuit", true);
    confWnd.Button_SetCheckState("ChkReturn", true);
    confWnd.Button_SetCheckState("ChkTypes", true);
    confWnd.Button_SetCheckState("ChkMoveDB", false);
    confWnd.Button_SetCheckState("ChkItem", true);
    confWnd.Button_SetCheckState("ChkEquip", true);
    confWnd.Button_SetCheckState("ChkCustomGo", true);
    confWnd.Button_SetCheckState("ChkDisplayTypes", true);
    confWnd.Button_SetCheckState("ChkMustBePokemon", false);
    confWnd.Button_SetCheckState("ChkMoveDBOnly", false);
    confWnd.SetControlText("EdtstatOcc", 10);
    confWnd.SetControlText("EdtmodOcc", 10);
    confWnd.SetControlText("EdtflinchOcc", 5);
    confWnd.SetControlText("EdtcritOcc", 10);
    confWnd.SetControlText("EdtmissOcc", 8);
    confWnd.SetControlText("EdtcureOcc", 75);
    confWnd.SetControlText("EdtstripOcc", 10);
    confWnd.SetControlText("EdtrecoilOcc", 2);
    confWnd.SetControlText("EdtFormatting", "$MSG");
    confWnd.SetControlText("EdtHPMin", 400);
    confWnd.SetControlText("EdtHPMax", 500);
    confWnd.SetControlText("EdtAtkMin", 100);
    confWnd.SetControlText("EdtAtkMax", 200);
    confWnd.SetControlText("EdtDefMin", 100);
    confWnd.SetControlText("EdtDefMax", 200);
    confWnd.SetControlText("EdtSpeMin", 100);
    confWnd.SetControlText("EdtSpeMax", 200);
    confWnd.SetControlText("EdtSpcMin", 100);
    confWnd.SetControlText("EdtSpcMax", 200);
    break;
  case "ChkMustBePokemon":
    if (confWnd.Button_IsChecked("ChkMustBePokemon") === true) {
      confWnd.Button_SetCheckState("ChkCustomGo", false);
    }
    break;
  case "ChkCustomGo":
    if (confWnd.Button_IsChecked("ChkCustomGo") === true) {
      confWnd.Button_SetCheckState("ChkMustBePokemon", false);
    }
    break;
  case "ChkMoveDBOnly":
    if (confWnd.Button_IsChecked("ChkMoveDBOnly") === true) {
      confWnd.Button_SetCheckState("ChkMoveDB", true);
    }
    break;
  case "ChkMoveDB":
    if (confWnd.Button_IsChecked("ChkMoveDB") === false) {
      confWnd.Button_SetCheckState("ChkMoveDBOnly", false);
    }
    break;
  case "ChkTypes":
    if (confWnd.Button_IsChecked("ChkTypes") === false) {
      confWnd.Button_SetCheckState("ChkDisplayTypes", false);
    }
    break;
  case "ChkDisplayTypes":
    if (confWnd.Button_IsChecked("ChkDisplayTypes") === true) {
      confWnd.Button_SetCheckState("ChkTypes", true);
    }
    break;
  }
}

function loadPrefsWnd(confWnd) {

  confWnd.SetControlText("EdtFormatting", obConf.Pref.msgFormat[0] + "$MSG" + obConf.Pref.msgFormat[1]);

  confWnd.Button_SetCheckState("ChkHeal", obConf.Pref.healOn);
  confWnd.Button_SetCheckState("ChkQuit", obConf.Pref.quitOn);
  confWnd.Button_SetCheckState("ChkReturn", obConf.Pref.returnOn);
  confWnd.Button_SetCheckState("ChkTypes", obConf.Pref.typesOn);
  confWnd.Button_SetCheckState("ChkMoveDB", obConf.Pref.moveDBOn);
  confWnd.Button_SetCheckState("ChkItem", obConf.Pref.itemOn);
  confWnd.Button_SetCheckState("ChkEquip", obConf.Pref.equipOn);
  confWnd.Button_SetCheckState("ChkCustomGo", obConf.Pref.customGoOn);
  confWnd.Button_SetCheckState("ChkDisplayTypes", obConf.Pref.displayTypesOn);
  confWnd.Button_SetCheckState("ChkMustBePokemon", obConf.Pref.mustBePokemonOn);
  confWnd.Button_SetCheckState("ChkMoveDBOnly", obConf.Pref.moveDBOnlyOn);

  confWnd.SetControlText("EdtstatOcc", obConf.OccRate.status * 100);
  confWnd.SetControlText("EdtmodOcc", obConf.OccRate.mod * 100);
  confWnd.SetControlText("EdtflinchOcc", obConf.OccRate.flinch * 100);
  confWnd.SetControlText("EdtcritOcc", obConf.OccRate.crit * 100);
  confWnd.SetControlText("EdtrecoilOcc", obConf.OccRate.recoil * 100);
  confWnd.SetControlText("EdtmissOcc", obConf.OccRate.miss * 100);
  confWnd.SetControlText("EdtcureOcc", obConf.OccRate.cure * 100);
  confWnd.SetControlText("EdtstripOcc", obConf.OccRate.strip * 100);
  confWnd.SetControlText("EdtrecoilOcc", obConf.OccRate.recoil * 100);

  confWnd.SetControlText("EdtHPMin", obConf.Stat.HPMin);
  confWnd.SetControlText("EdtHPMax", obConf.Stat.HPMax);
  confWnd.SetControlText("EdtAtkMin", obConf.Stat.AtkMin);
  confWnd.SetControlText("EdtAtkMax", obConf.Stat.AtkMax);
  confWnd.SetControlText("EdtDefMin", obConf.Stat.DefMin);
  confWnd.SetControlText("EdtDefMax", obConf.Stat.DefMax);
  confWnd.SetControlText("EdtSpeMin", obConf.Stat.SpeMin);
  confWnd.SetControlText("EdtSpeMax", obConf.Stat.SpeMax);
  confWnd.SetControlText("EdtSpcMin", obConf.Stat.SpcMin);
  confWnd.SetControlText("EdtSpcMax", obConf.Stat.SpcMax);
}

function saveConfig(confWnd) {
  settings.Save("Pref", "typesOn", confWnd.Button_IsChecked("ChkTypes"));
  settings.Save("Pref", "healOn", confWnd.Button_IsChecked("ChkHeal"));
  settings.Save("Pref", "returnOn", confWnd.Button_IsChecked("ChkReturn"));
  settings.Save("Pref", "quitOn", confWnd.Button_IsChecked("ChkQuit"));
  settings.Save("Pref", "moveDBOn", confWnd.Button_IsChecked("ChkMoveDB"));
  settings.Save("Pref", "itemOn", confWnd.Button_IsChecked("ChkItem"));
  settings.Save("Pref", "equipOn", confWnd.Button_IsChecked("ChkEquip"));
  settings.Save("Pref", "customGoOn", confWnd.Button_IsChecked("ChkCustomGo"));
  settings.Save("Pref", "displayTypesOn", confWnd.Button_IsChecked("ChkDisplayTypes"));
  settings.Save("Pref", "mustBePokemonOn", confWnd.Button_IsChecked("ChkMustBePokemon"));
  settings.Save("Pref", "moveDBOnlyOn", confWnd.Button_IsChecked("ChkMoveDBOnly"));

  settings.Save("Stat", "HPMin", confWnd.GetControlText("EdtHPMin"), true);
  settings.Save("Stat", "HPMax", confWnd.GetControlText("EdtHPMax"), true);
  settings.Save("Stat", "AtkMin", confWnd.GetControlText("EdtAtkMin"), true);
  settings.Save("Stat", "AtkMax", confWnd.GetControlText("EdtAtkMax"), true);
  settings.Save("Stat", "DefMin", confWnd.GetControlText("EdtDefMin"), true);
  settings.Save("Stat", "DefMax", confWnd.GetControlText("EdtDefMax"), true);
  settings.Save("Stat", "SpeMin", confWnd.GetControlText("EdtSpeMin"), true);
  settings.Save("Stat", "SpeMax", confWnd.GetControlText("EdtSpeMax"), true);
  settings.Save("Stat", "SpcMin", confWnd.GetControlText("EdtSpcMin"), true);
  settings.Save("Stat", "SpcMax", confWnd.GetControlText("EdtSpcMax"), true);

  settings.Save("OccRate", "status", confWnd.GetControlText("EdtstatOcc"), true);
  settings.Save("OccRate", "crit", confWnd.GetControlText("EdtcritOcc"), true);
  settings.Save("OccRate", "mod", confWnd.GetControlText("EdtmodOcc"), true);
  settings.Save("OccRate", "miss", confWnd.GetControlText("EdtmissOcc"), true);
  settings.Save("OccRate", "flinch", confWnd.GetControlText("EdtflinchOcc"), true);
  settings.Save("OccRate", "cure", confWnd.GetControlText("EdtcureOcc"), true);
  settings.Save("OccRate", "recoil", confWnd.GetControlText("EdtrecoilOcc"), true);
  settings.Save("OccRate", "strip", confWnd.GetControlText("EdtstripOcc"), true);

  str = confWnd.GetControlText("EdtFormatting");
  match = str.match(/\$MSG/g);
  if (match !== null && match.length === 1) {
    settings.Save("Pref", "msgFormat", str);
  }

  settings.LoadFile.Conf();
  loadPrefsWnd(confWnd);
}
//Equip
function loadEquipWnd(equipWnd) {
  //Remove current list items
  for (i = equipWnd.LstView_GetCount("LvEquip") - 1; i >= 0; i--) {
    equipWnd.LstView_RemoveItem("LvEquip", i);
  }
  //(Re)populate list
  i = 0;
  for (sName in obEquipDB) {
    equipWnd.LstView_AddItem("LvEquip", sName);
    equipWnd.LstView_SetItemText("LvEquip", i, 1, obEquipDB[sName].Desc);
    equipWnd.LstView_SetItemText("LvEquip", i, 2, obEquipDB[sName].Enabled);
    i++;
  }
}

function OnWndEquipEvent_CtrlClicked(equipWnd, ControlId) {
  switch (ControlId) {
  case "BtnAdd":
    addEquipWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndAddEquip");
    //Populate dropdown menus
    for (var i = -2; i <= 6; i++) {
      addEquipWnd.Combo_AddItem("CbSts", obTrans.GetWindow("WndAddEquip").GetString("CbSts" + i), i);
    }
    for (var i = -2; i <= -1; i++) {
      addEquipWnd.Combo_AddItem("CbImm", obTrans.GetWindow("WndAddEquip").GetString("CbImm" + i), i);
    }
    for (var i = 0; i <= 6; i++) {
      addEquipWnd.Combo_AddItem("CbImm", obTrans.GetWindow("WndAddEquip").GetString("CbSts" + i), i);
    }
    addEquipWnd.Combo_SetCurSel("CbSts", 0);
    addEquipWnd.Combo_SetCurSel("CbImm", 0);
    break;
  case "BtnDelete":
    //Loop through the list to find the selected item
    for (var i = 0; i <= equipWnd.LstView_GetCount("LvEquip"); i++) {
      if (equipWnd.LstView_GetSelectedState("LvEquip", i) === true) {
        iniIntf.DeleteHeader("equipDB", equipWnd.LstView_GetItemText("LvEquip", i, 0));
        settings.LoadFile.Equip();
        loadEquipWnd(equipWnd);
        break;
      }
    }
    break;
  case "BtnEnable":
    //Loop through the list to find the selected item
    for (var i = 0; i <= equipWnd.LstView_GetCount("LvEquip"); i++) {
      if (equipWnd.LstView_GetSelectedState("LvEquip", i) === true) {
        name = equipWnd.LstView_GetItemText("LvEquip", i, 0);
        iniIntf.WriteIni("equipDB", name, "Enabled", (obEquipDB[name].Enabled === false) ? true : false);
        settings.LoadFile.Equip();
        loadEquipWnd(equipWnd);
        break;
      }
    }
    break;
  }
}
//Create equip item
function OnWndAddEquipEvent_CtrlClicked(addEquipWnd, ControlId) {
  switch (ControlId) {
  case "BtnConfirm":
    var addEquipEff = "";
    var arEdt = ["EdtAbsMod0", "EdtAbsMod1", "EdtAbsMod2", "EdtAbsMod3", "EdtRelMod0", "EdtRelMod1", "EdtRelMod2", "EdtRelMod3", "EdtPerMod0", "EdtPerMod1", "EdtPerMod2", "EdtPerMod3"];
    var arMod = ["a0", "a1", "a2", "a3", "m0", "m1", "m2", "m3", "p0", "p1", "p2", "p3"];
    var i = 0;
    while (i < 12) {
      j = parseInt(addEquipWnd.GetControlText(arEdt[i]), 10);
      addEquipEff += (isNaN(j) === true || j === 0) ? "" : (arMod[i] + (j > 0 ? "+" : "") + j);
      i++;
    }
    i = addEquipWnd.Combo_GetItemData("CbImm", addEquipWnd.Combo_GetCurSel("CbImm"));
    addEquipEff += (i !== -2) ? "i" + i : "";
    i = addEquipWnd.Combo_GetItemData("CbSts", addEquipWnd.Combo_GetCurSel("CbSts"));
    switch (i) {
    case -2:
      addEquipEff += "";
      break;
    case -1:
      addEquipEff += "c";
      break;
    default:
      addEquipEff += "s" + i;
    }
    var name = sanitizeStr(addEquipWnd.GetControlText("EdtName")).toLowerCase();
    iniIntf.WriteIni("equipDB", name, "Eff", addEquipEff);
    iniIntf.WriteIni("equipDB", name, "Desc", sanitizeStr(addEquipWnd.GetControlText("EdtDesc")));
    iniIntf.WriteIni("equipDB", name, "Text", sanitizeStr(addEquipWnd.GetControlText("EdtMsg")));
    iniIntf.WriteIni("equipDB", name, "Enabled", true);
    addEquipWnd.Close(1);
    settings.LoadFile.Equip();
    loadEquipWnd(equipWnd);
    break;
  }
}

function OnWndEquipEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx) {
  sName = PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0);
  iniIntf.WriteIni("equipDB", sName, "Enabled", (obEquipDB[sName].Enabled === false) ? true : false);
  settings.LoadFile.Equip();
  loadEquipWnd(equipWnd);
}

function loadShopWnd(shopWnd) {
  //Remove current list items
  for (i = shopWnd.LstView_GetCount("LvItems"); i >= 0; i--) {
    shopWnd.LstView_RemoveItem("LvItems", i);
  }
  //(Re)populate list
  i = 0;
  for (sName in obItemDB) {
    shopWnd.LstView_AddItem("LvItems", sName);
    shopWnd.LstView_SetItemText("LvItems", i, 1, obItemDB[sName].Desc);
    shopWnd.LstView_SetItemText("LvItems", i, 2, obItemDB[sName].Enabled);
    i++;
  }
}

function OnWndShopEvent_CtrlClicked(shopWnd, ControlId) {
  switch (ControlId) {
  case "BtnAdd":
    addItemWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndAddItem");
    //Populate dropdown menus
    for (i = -2; i <= 6; i++) {
      addItemWnd.Combo_AddItem("CbSts", obTrans.GetWindow("WndAddItem").GetString("CbSts" + i), i);
    }
    for (i = 0; i <= 2; i++) {
      addItemWnd.Combo_AddItem("CbResHP", obTrans.GetWindow("WndAddItem").GetString("CbHP" + i), i);
    }
    addItemWnd.Combo_SetCurSel("CbSts", 0);
    addItemWnd.Combo_SetCurSel("CbResHP", 0);
    break;
  case "BtnDelete":
    //Loop through the list to find the selected item
    for (i = 0; i <= shopWnd.LstView_GetCount("LvItems"); i++) {
      if (shopWnd.LstView_GetSelectedState("LvItems", i) === true) {
        iniIntf.DeleteHeader("itemDB", shopWnd.LstView_GetItemText("LvItems", i, 0));
        settings.LoadFile.Item();
        loadShopWnd(shopWnd);
        break;
      }
    }
    break;
  case "BtnEnable":
    //Loop through the list to find the selected item
    for (i = 0; i <= shopWnd.LstView_GetCount("LvItems"); i++) {
      if (shopWnd.LstView_GetSelectedState("LvItems", i) === true) {
        name = shopWnd.LstView_GetItemText("LvItems", i, 0);
        iniIntf.WriteIni("itemDB", name, "Enabled", (obItemDB[name].Enabled === false) ? true : false);
        settings.LoadFile.Item();
        loadShopWnd(shopWnd);
        break;
      }
    }
    break;
  }
}

//Create item
function OnWndAddItemEvent_CtrlClicked(addItemWnd, ControlId) {
  switch (ControlId) {
  case "BtnConfirm":
    var addItemEff = "";
    //Stat mods
    var arEdt = ["EdtAbsMod0", "EdtAbsMod1", "EdtAbsMod2", "EdtAbsMod3", "EdtRelMod0", "EdtRelMod1", "EdtRelMod2", "EdtRelMod3", "EdtPerMod0", "EdtPerMod1", "EdtPerMod2", "EdtPerMod3"];
    var arMod = ["a0", "a1", "a2", "a3", "m0", "m1", "m2", "m3", "p0", "p1", "p2", "p3"];
    i = 0;
    while (i < 12) {
      j = parseInt(addItemWnd.GetControlText(arEdt[i]), 10);
      addItemEff += (isNaN(j) === true || j === 0) ? "" : (arMod[i] + (j > 0 ? "+" : "") + j);
      i++;
    }
    //Healing
    j = parseInt(addItemWnd.GetControlText("EdtHPAmt"), 10);
    if (isFinite(j) === true) {
      i = addItemWnd.Combo_GetItemData("CbResHP", addItemWnd.Combo_GetCurSel("CbResHP"));
      j = (i === 2 && t > 100) ? 100 : j;
      addItemEff += "h" + (i === 2 ? "1" : "0") + j;
    }
    //Status
    i = addItemWnd.Combo_GetItemData("CbSts", addItemWnd.Combo_GetCurSel("CbSts"));
    switch (i) {
    case -2:
      break;
    case -1:
      addItemEff += "c";
      break;
    default:
      addItemEff += "s" + i;
    }
    name = sanitizeStr(addItemWnd.GetControlText("EdtName")).toLowerCase();
    iniIntf.WriteIni("itemDB", name, "Effect", addItemEff);
    iniIntf.WriteIni("itemDB", name, "Desc", sanitizeStr(addItemWnd.GetControlText("EdtDesc")));
    iniIntf.WriteIni("itemDB", name, "Enabled", true);
    addItemWnd.Close(1);
    settings.LoadFile.Item();
    loadShopWnd(shopWnd);
    break;
  }
}

function OnWndShopEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx) {
  sName = PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0);
  iniIntf.WriteIni("itemDB", sName, "Enabled", (obItemDB[sName].Enabled === false) ? true : false);
  settings.LoadFile.Item();
  loadShopWnd(shopWnd);
}

function loadMonWnd(monWnd) {
  //Remove current list items
  for (i = monWnd.LstView_GetCount("LvMons") - 1; i >= 0; i--) {
    monWnd.LstView_RemoveItem("LvMons", i);
  }
  //(Re)populate list
  i = 0;
  for (sName in obMonParty) {
    monWnd.LstView_AddItem("LvMons", obMonParty[sName].Name);
    monWnd.LstView_SetItemText("LvMons", i, 1, obTrans.Types().GetString(obMonParty[sName].Type[0]) + (obMonParty[sName].Type[1] === undefined ? "" : ("," + obTrans.Types().GetString(obMonParty[sName].Type[1]))));
    monWnd.LstView_SetItemText("LvMons", i, 2, obMonParty[sName].HPCur + "\/" + obMonParty[sName].HPMax);
    monWnd.LstView_SetItemText("LvMons", i, 3, obMonParty[sName].Atk);
    monWnd.LstView_SetItemText("LvMons", i, 4, obMonParty[sName].Def);
    monWnd.LstView_SetItemText("LvMons", i, 5, obMonParty[sName].Spe);
    monWnd.LstView_SetItemText("LvMons", i, 6, obMonParty[sName].Spc);
    monWnd.LstView_SetItemText("LvMons", i, 7, obMonParty[sName].Enabled);
    i++;
  }
}

function loadEditMonWnd(PlusWnd, sMonName) {
  PlusWnd.Combo_AddItem("CbType1", "-", -1);
  for (i = 0; i < aTypeMatchup.length; i++) {
    PlusWnd.Combo_AddItem("CbType0", obTrans.Types().GetString(i));
    PlusWnd.Combo_AddItem("CbType1", obTrans.Types().GetString(i));
  }
  if (obMonParty[sMonName] !== undefined) {
    PlusWnd.Combo_SetCurSel("CbType0", obMonParty[sMonName].Type[0]);
    PlusWnd.Combo_SetCurSel("CbType1", (obMonParty[sMonName].Type[1] === undefined ? 0 : obMonParty[sMonName].Type[1] + 1));
    for (v in a = ["Name", "Atk", "Def", "Spe", "Spc", "HPMax"]) {
      PlusWnd.SetControlText("Edt" + a[v], obMonParty[sMonName][a[v]]);
    }
  } else {
    PlusWnd.Combo_SetCurSel("CbType0", 0);
    PlusWnd.Combo_SetCurSel("CbType1", 0);
  }
}

function OnWndMonsEvent_CtrlClicked(monWnd, ControlId) {
  switch (ControlId) {
  case "BtnDelete":
    //Loop through the list to find the selected item
    for (i = 0; i < monWnd.LstView_GetCount("LvMons"); i++) {
      if (monWnd.LstView_GetSelectedState("LvMons", i) === true) {
        iniIntf.DeleteHeader("monParty", monWnd.LstView_GetItemText("LvMons", i, 0));
        settings.LoadFile.Mon();
        loadMonWnd(monWnd);
        break;
      }
    }
    break;
  case "BtnEdit":
    //Loop through the list to find the selected item
    for (i = 0; i < monWnd.LstView_GetCount("LvMons"); i++) {
      if (monWnd.LstView_GetSelectedState("LvMons", i) === true) {
        loadEditMonWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditMon"), monWnd.LstView_GetItemText("LvMons", i, 0));
        break;
      }
    }
    break;
  case "BtnAdd":
    loadEditMonWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditMon"), "");
    break;
  case "BtnEnable":
    //Loop through the list to find the selected item
    for (i = 0; i <= monWnd.LstView_GetCount("LvMons"); i++) {
      if (monWnd.LstView_GetSelectedState("LvMons", i) === true) {
        name = monWnd.LstView_GetItemText("LvMons", i, 0);
        iniIntf.WriteIni("monParty", name, "Enabled", (obMonParty[name].Enabled === false) ? true : false);
        settings.LoadFile.Mon();
        loadMonWnd(monWnd);
        break;
      }
    }
    break;
  }
}

function OnWndEditMonEvent_CtrlClicked(PlusWnd, ControlId) {
  switch (ControlId) {
  case "BtnConfirm":
    monName = sanitizeStr(PlusWnd.GetControlText("EdtName")).toLowerCase();
    if (monName !== "") {
      iniIntf.WriteIni("monParty", monName, "Name", monName);
      iniIntf.WriteIni("monParty", monName, "Type", PlusWnd.Combo_GetCurSel("CbType0") + (PlusWnd.Combo_GetCurSel("CbType1") === 0 ? "" : "," + (PlusWnd.Combo_GetCurSel("CbType1") - 1)));
      for (v in a = ["Atk", "Def", "Spe", "Spc", "HPMax"]) {
        if (isFinite(PlusWnd.GetControlText("Edt" + a[v]))) {
          iniIntf.WriteIni("monParty", monName, a[v], PlusWnd.GetControlText("Edt" + a[v]));
        } else {
          iniIntf.WriteIni("monParty", monName, a[v], 100);
        }
      }
      iniIntf.WriteIni("monParty", monName, "HPCur", -1);
      iniIntf.WriteIni("monParty", monName, "Status", -1);
      iniIntf.WriteIni("monParty", monName, "Lvl", 1);
      iniIntf.WriteIni("monParty", monName, "Exp", 0);
      iniIntf.WriteIni("monParty", monName, "Enabled", true);
      PlusWnd.Close(1);
      settings.LoadFile.Mon();
      loadMonWnd(monWnd);
      break;
    }
  }
}

//right click toggles enabled state
function OnWndMonsEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx) {
  sName = PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0);
  iniIntf.WriteIni("monParty", sName, "Enabled", (obMonParty[sName].Enabled === false) ? true : false);
  settings.LoadFile.Mon();
  loadMonWnd(monWnd);
}

function OnWndMonsEvent_LstViewDblClicked(PlusWnd, ControlId, ItemIdx) {
  loadEditMonWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditMon"), PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0));
}
//Equip
function loadMoveWnd(moveWnd) {
  //Remove current list items
  for (i = moveWnd.LstView_GetCount("LvMoves") - 1; i >= 0; i--) {
    moveWnd.LstView_RemoveItem("LvMoves", i);
  }
  //(Re)populate list
  i = 0;
  for (sName in obMoveDB) {
    moveWnd.LstView_AddItem("LvMoves", sName);
    moveWnd.LstView_SetItemText("LvMoves", i, 1, obTrans.Types().GetString(obMoveDB[sName].Type));
    moveWnd.LstView_SetItemText("LvMoves", i, 2, obMoveDB[sName].Pwr);
    moveWnd.LstView_SetItemText("LvMoves", i, 3, obMoveDB[sName].Acc);
    moveWnd.LstView_SetItemText("LvMoves", i, 4, obMoveDB[sName].Eff);
    i++;
  }
}

function OnWndMovesEvent_CtrlClicked(moveWnd, ControlId) {
  switch (ControlId) {
  case "BtnDelete":
    //Loop through the list to find the selected item
    for (i = 0; i < moveWnd.LstView_GetCount("LvMoves"); i++) {
      if (moveWnd.LstView_GetSelectedState("LvMoves", i) === true) {
        iniIntf.DeleteHeader("moveDB", moveWnd.LstView_GetItemText("LvMoves", i, 0));
        settings.LoadFile.Move();
        loadMoveWnd(moveWnd);
        break;
      }
    }
    break;
  case "BtnEdit":
    //Loop through the list to find the selected item
    for (i = 0; i < moveWnd.LstView_GetCount("LvMoves"); i++) {
      if (moveWnd.LstView_GetSelectedState("LvMoves", i) === true) {
        loadEditMoveWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditMove"), moveWnd.LstView_GetItemText("LvMoves", i, 0));
        break;
      }
    }
    break;
  case "BtnAdd":
    loadEditMoveWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditMove"), "");
    break;
  case "BtnEnable":
    //Loop through the list to find the selected item
    for (i = 0; i <= moveWnd.LstView_GetCount("LvMons"); i++) {
      if (moveWnd.LstView_GetSelectedState("LvMons", i) === true) {
        name = moveWnd.LstView_GetItemText("LvMons", i, 0);
        iniIntf.WriteIni("moveDB", name, "Enabled", (obMoveDB[name].Enabled === false) ? true : false);
        settings.LoadFile.Move();
        loadMoveWnd(moveWnd);
        break;
      }
    }
    break;
  }
}

function OnWndMovesEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx) {
  sName = PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0);
  iniIntf.WriteIni("moveDB", sName, "Enabled", (obMoveDB[sName].Enabled === false) ? true : false);
  settings.LoadFile.Move();
  loadMoveWnd(moveWnd);
}

function OnWndMovesEvent_LstViewDblClicked(PlusWnd, ControlId, ItemIdx) {
  loadEditMoveWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditMove"), PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0));
}

function loadEditMoveWnd(PlusWnd, sMoveName) {
  for (i = 0; i < aTypeMatchup.length; i++) {
    PlusWnd.Combo_AddItem("CbType", obTrans.Types().GetString(i));
  }
  if (obMoveDB[sMoveName] !== undefined) {
    PlusWnd.Combo_SetCurSel("CbType", obMoveDB[sMoveName].Type);
    PlusWnd.SetControlText("EdtName", sMoveName);
    for (v in a = ["Acc", "Pwr", "Eff"]) {
      PlusWnd.SetControlText("Edt" + a[v], obMoveDB[sMoveName][a[v]]);
    }
  } else {
    PlusWnd.Combo_SetCurSel("CbType", 0);
  }
}

function OnWndEditMoveEvent_CtrlClicked(PlusWnd, ControlId) {
  switch (ControlId) {
  case "BtnConfirm":
    sMoveName = sanitizeStr(PlusWnd.GetControlText("EdtName")).toLowerCase();
    if (sMoveName !== "") {
      iniIntf.WriteIni("moveDB", sMoveName, "Name", sMoveName);
      iniIntf.WriteIni("moveDB", sMoveName, "Type", PlusWnd.Combo_GetCurSel("CbType"));
      for (v in a = ["Acc", "Pwr"]) {
        if (isFinite(PlusWnd.GetControlText("Edt" + a[v]))) {
          iniIntf.WriteIni("moveDB", sMoveName, a[v], PlusWnd.GetControlText("Edt" + a[v]));
        } else {
          iniIntf.WriteIni("moveDB", sMoveName, a[v], 1);
        }
      }
      iniIntf.WriteIni("moveDB", sMoveName, "Eff", sanitizeStr(PlusWnd.GetControlText("EdtEff")));
      //iniIntf.WriteIni("moveDB", sMoveName, "Enabled", true);
      PlusWnd.Close(1);
      settings.LoadFile.Move();
      loadMoveWnd(moveWnd);
      break;
    }
  }
}

exports.Alea = Alea;
exports.Mash = Mash;
exports.OnEvent_ChatWndReceiveMessage = OnEvent_ChatWndReceiveMessage;
exports.OnEvent_ChatWndSendMessage = OnEvent_ChatWndSendMessage;
exports.OnGetScriptCommands = OnGetScriptCommands;
exports.attackMon = attackMon;
exports.healMon = healMon;
exports.occRate = occRate;
exports.CreateMon = CreateMon;
exports.LoadMon = LoadMon;
exports.randomStat = randomStat;
exports.sendMsg = sendMsg;
exports.displayHP = displayHP;
exports.displayType = displayType;
exports.changeTurn = changeTurn;
exports.notYourTurn = notYourTurn;
exports.sanitizeStr = sanitizeStr;
exports.useItem = useItem;
exports.equipItem = equipItem;
exports.unequipItem = unequipItem;
exports.OnGetScriptMenu = OnGetScriptMenu;
exports.OnEvent_MenuClicked = OnEvent_MenuClicked;
exports.OnEvent_Initialize = OnEvent_Initialize;
exports.OnEvent_Uninitialize = OnEvent_Uninitialize;
exports.PokemonTypes = PokemonTypes;
exports.OnWndAboutEvent_CtrlClicked = OnWndAboutEvent_CtrlClicked;
exports.openPage = openPage;
exports.loadCmdWnd = loadCmdWnd;
exports.OnWndCommandsEvent_CtrlClicked = OnWndCommandsEvent_CtrlClicked;
exports.OnWndCommandsEvent_LstViewDblClicked = OnWndCommandsEvent_LstViewDblClicked;
exports.loadEditCmdWnd = loadEditCmdWnd;
exports.OnWndEditCmdEvent_CtrlClicked = OnWndEditCmdEvent_CtrlClicked;
exports.OnWndConfigEvent_CtrlClicked = OnWndConfigEvent_CtrlClicked;
exports.loadPrefsWnd = loadPrefsWnd;
exports.saveConfig = saveConfig;
exports.loadEquipWnd = loadEquipWnd;
exports.OnWndEquipEvent_CtrlClicked = OnWndEquipEvent_CtrlClicked;
exports.OnWndAddEquipEvent_CtrlClicked = OnWndAddEquipEvent_CtrlClicked;
exports.OnWndEquipEvent_LstViewRClicked = OnWndEquipEvent_LstViewRClicked;
exports.loadShopWnd = loadShopWnd;
exports.OnWndShopEvent_CtrlClicked = OnWndShopEvent_CtrlClicked;
exports.OnWndAddItemEvent_CtrlClicked = OnWndAddItemEvent_CtrlClicked;
exports.OnWndShopEvent_LstViewRClicked = OnWndShopEvent_LstViewRClicked;
exports.loadMonWnd = loadMonWnd;
exports.loadEditMonWnd = loadEditMonWnd;
exports.OnWndMonsEvent_CtrlClicked = OnWndMonsEvent_CtrlClicked;
exports.OnWndEditMonEvent_CtrlClicked = OnWndEditMonEvent_CtrlClicked;
exports.OnWndMonsEvent_LstViewRClicked = OnWndMonsEvent_LstViewRClicked;
exports.OnWndMonsEvent_LstViewDblClicked = OnWndMonsEvent_LstViewDblClicked;
exports.loadMoveWnd = loadMoveWnd;
exports.OnWndMovesEvent_CtrlClicked = OnWndMovesEvent_CtrlClicked;
exports.OnWndMovesEvent_LstViewRClicked = OnWndMovesEvent_LstViewRClicked;
exports.OnWndMovesEvent_LstViewDblClicked = OnWndMovesEvent_LstViewDblClicked;
exports.loadEditMoveWnd = loadEditMoveWnd;
exports.OnWndEditMoveEvent_CtrlClicked = OnWndEditMoveEvent_CtrlClicked;
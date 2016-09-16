'use strict';
//No, none of the filenames make any sense.

function CreateMon(strName) {
  this.Name = strName === "" ? randomPokemon().toUpperCase() : strName.toUpperCase();
  this.Atk = randomStat(global.obConf.Stat.AtkMin, global.obConf.Stat.AtkMax);
  this.Def = randomStat(global.obConf.Stat.DefMin, global.obConf.Stat.DefMax);
  this.Spe = randomStat(global.obConf.Stat.SpeMin, global.obConf.Stat.SpeMax);
  this.Spc = randomStat(global.obConf.Stat.SpcMin, global.obConf.Stat.SpcMax);
  this.HPMax = randomStat(global.obConf.Stat.HPMin, global.obConf.Stat.HPMax);
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

function LoadMon(global.obMon) {
  this.Name = global.obMon.Name.toUpperCase();;
  this.Atk = parseInt(global.obMon.Atk);
  this.Def = parseInt(global.obMon.Def);
  this.Spe = parseInt(global.obMon.Spe);
  this.Spc = parseInt(global.obMon.Spc);
  this.HPMax = parseInt(global.obMon.HPMax);
  if(this.Atk === 0){this.Atk = randomStat(global.obConf.Stat.AtkMin, global.obConf.Stat.AtkMax);}
  if(this.Def === 0){this.Def = randomStat(global.obConf.Stat.DefMin, global.obConf.Stat.DefMax);}
  if(this.Spe === 0){this.Spe = randomStat(global.obConf.Stat.SpeMin, global.obConf.Stat.SpeMax);}
  if(this.Spc === 0){this.Spc = randomStat(global.obConf.Stat.SpcMin, global.obConf.Stat.SpcMax);}
  if(this.HPMax === 0){this.HPMax = randomStat(global.obConf.Stat.HPMin, global.obConf.Stat.HPMax);}
  //this.HPCur = parseInt(global.obMon.HPCur,10);
  this.HPCur = this.HPMax;
  this.Type = global.obMon.Type;
  this.Mod = [0, 0, 0, 0];
  this.Status = {
    "ID": parseInt(global.obMon.Status),
    "Recharge": 0
  };
  this.Equip = {
    "Name": "",
    "Eff": ""
  };
}

function randomStat(min, max){
  return Math.ceil(global.rand() * (max - min) + min);
}

function sendMsg(sMsg) {
  global.bWnd[global.iWnd].Wnd.SendMessage(global.obConf.Pref.msgFormat[0] + "*" + sMsg + global.obConf.Pref.msgFormat[1]);
}

function displayHP(Mon) {
  sendMsg(Mon.Name + ": " + Mon.HPCur + "\/" + Mon.HPMax + " HP");
}

function displayType(aType) {
  if (global.obConf.Pref.displayTypesOn === true) {
    return (global.obTrans.Types().GetString(aType[0]) + (aType[1] !== undefined ? ("," + global.obTrans.Types().GetString(aType[1])) : "")).toUpperCase();
  }
  else {
    return "???";
  }
}

function changeTurn(Turn, offMon, defMon) {
  //Debug.Trace("mon that just attacked was player "+Turn);
  if (defMon.HPCur > 0 && offMon.HPCur > 0) {
    global.bWnd[global.iWnd].Turn = (Turn === 1 ? 2 : 1);
    //Debug.Trace("switching to player "+global.bWnd[global.iWnd].Turn);
    if (defMon.Status.Recharge === 1) {
      defMon.Status.Recharge = 0;
      global.bWnd[global.iWnd].Turn = (global.bWnd[global.iWnd].Turn === 1 ? 2 : 1);
      //Debug.Trace("that player is recharging, switch back to player "+global.bWnd[global.iWnd].Turn);
      sendMsg(global.obTrans.GetMessages().GetString("MustRecharge").replace(/MON_NAME/, defMon.Name));
    }
  }
  else {
    if (offMon.HPCur <= 0) { //check the attackers's HP first, if both are 0, the defender wins
      var loser = global.bWnd[global.iWnd].Player[Turn].Name;
      var winner = global.bWnd[global.iWnd].Player[Turn === 1 ? 2 : 1].Name;
    }
    else {
      var loser = global.bWnd[global.iWnd].Player[Turn === 1 ? 2 : 1].Name;
      var winner = global.bWnd[global.iWnd].Player[Turn].Name;
    }
    sendMsg(global.obTrans.GetMessages().GetString("BattleEnd").replace(/PLAYER1_NAME/, winner).replace(/PLAYER2_NAME/, loser));
    global.bWnd.splice(global.iWnd, 1);
    if (winner === Messenger.MyName) {
      settings.UpdateRecord("win");
    }
    else if (loser === Messenger.MyName) {
      settings.UpdateRecord("lose");
    }
  }
}

function notYourTurn() {
  sendMsg(global.obTrans.GetMessages().GetString("NotYourTurn"));
}

function sanitizeStr(str) {
  return str.replace(/\[/g, "").replace(/\]/g, "").replace(/\;/g, "").replace(/\=/g, "");
}

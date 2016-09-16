function OnEvent_Initialize() { // TODO - Missing polyfill
  //Debug.ClearDebuggingWindow();
  //v5.0 has a lot of changes, so only restore if it's already at least v5.0
  currentVersion = parseFloat(iniIntf.ReadIni("settings", "Version", "current", 5));
  previousVersion = parseFloat(iniIntf.ReadIni("settings", "Version", "previous", 4));
  if(previousVersion >= 5) {
    settings.Restore();
    settings.LoadScript();
  }
  else {
    settings.Save("Version", "previous", currentVersion, false);
    settings.LoadScript();
    settings.Backup();
  }
}
function OnEvent_Uninitialize() { // TODO - Missing polyfill
  settings.Backup();
}

var settings = {
  LoadScript: function() {
    for (f in settings.LoadFile) {
      settings.LoadFile[f]();
    }
    global.obConf.Pref.enabled = true;
    global.obTrans = new Translation(global.obConf.Pref.lang);
    global.obTrans.TranslateFile(MsgPlus.ScriptFilesPath + "\\XMLWindows.xml");
    global.bWnd = [];
    //seed = "Sun Sep 30 19:32:52 CDT 2012";
    seed = new Date();
    Debug.Trace("Seed: "+seed);
    global.rand = new Alea(seed);
    Debug.Trace("Script loaded.");
    settings.Debug(global.obConf.Pref);
  },
  LoadFile: {
    Conf: function() {
      global.obConf = iniIntf.ToObject("settings");
      global.obConf.Pref.msgFormat = iniIntf.ReadIni("settings", "Pref", "msgFormat", "$MSG").split("$MSG");
      //global.obConf.Pref.msgFormat = ["[c=3]","[\/c]"];
    },
    Cmd: function() {
      global.obCmds = iniIntf.ToObject("settings").Commands;
    },
    Equip: function() {
      global.obEquipDB = iniIntf.ToObject("equipDB");
    },
    Item: function() {
      global.obItemDB = iniIntf.ToObject("itemDB");
    },
    Move: function() {
      global.obMoveDB = iniIntf.ToObject("moveDB");
    },
    Mon: function() {
      global.obMonParty = iniIntf.ToObject("monParty");
      for (p in global.obMonParty) {
        if (typeof (global.obMonParty[p].Type) === "string" && global.obMonParty[p].Type.split(",").length > 1) {
          global.obMonParty[p].Type = [parseInt(global.obMonParty[p].Type.split(",")[0]), parseInt(global.obMonParty[p].Type.split(",")[1])];
        }
        else {
          global.obMonParty[p].Type = [global.obMonParty[p].Type];
        }
      }
    }
  },
  Save: function(header, key, value, isInt) {
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
  Backup: function() {
    try {
      var fso = w32Factory("Scripting.FileSystemObject");
      fso.CopyFolder(MsgPlus.ScriptFilesPath + "\\config", MsgPlus.ScriptFilesPath + "\\configbackup");
      Debug.Trace("Settings backup'd.");
    }
    catch (e) {
      Debug.Trace("BACKUP FAILED; catch: " + e);
    }
  },
  Restore: function() {
    try {
      var fso = w32Factory("Scripting.FileSystemObject");
      fso.CopyFolder(MsgPlus.ScriptFilesPath + "\\configbackup", MsgPlus.ScriptFilesPath + "\\config");
      Debug.Trace("Settings restored.");
    }
    catch (e) {
      Debug.Trace("RESTORE FAILED; catch: " + e);
    }
  },
  SetLanguage: function(str) {
    global.obTrans = new Translation(str);
    global.obTrans.TranslateFile(MsgPlus.ScriptFilesPath + "\\XMLWindows.xml");
    settings.Save("Pref", "lang", str);
  },
  UpdateRecord: function(prop) {
    global.obConf.Record[prop] += 1;
    iniIntf.WriteIni("settings", "record", prop, global.obConf.Record[prop]);
  },
  Debug: function(global.ob) {
    for(var p in global.ob) {
      Debug.Trace(p + ": " + global.ob[p]);
    }
  }
};

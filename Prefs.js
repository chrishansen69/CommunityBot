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
	LoadScript: function () {
		for (f in settings.LoadFile) {
			settings.LoadFile[f]();
		}
		obConf.Pref.enabled = true;
		obTrans = new Translation(obConf.Pref.lang);
		obTrans.TranslateFile(MsgPlus.ScriptFilesPath + "\\XMLWindows.xml");
		global.bWnd = [];
		//seed = "Sun Sep 30 19:32:52 CDT 2012";
		seed = new Date();
		Debug.Trace("Seed: "+seed);
		global.rand = new Alea(seed);
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
				}
				else {
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
		}
		catch (e) {
			Debug.Trace("BACKUP FAILED; catch: " + e);
		}
	},
	Restore: function () {
		try {
			var fso = w32Factory("Scripting.FileSystemObject");
			fso.CopyFolder(MsgPlus.ScriptFilesPath + "\\configbackup", MsgPlus.ScriptFilesPath + "\\config");
			Debug.Trace("Settings restored.");
		}
		catch (e) {
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
		for(var p in ob) {
			Debug.Trace(p + ": " + ob[p]);
		}
	}
};

var iniIntf = {
	DeleteHeader: function(filename, header) {
	//The following Read/Write/Del code was taken and modified from a post within the MsgPlus! forums http://www.msghelp.net/showthread.php?tid=83351&pid=904319#pid904319
		Interop.Call("kernel32", "WritePrivateProfileSectionW", header.toString(), 0, MsgPlus.ScriptFilesPath + "\\config\\" + filename + ".ini")
	},
	DeleteKey: function(filename, header, key) {
		Interop.Call("kernel32", "WritePrivateProfileStringW", header.toString(), key.toString(), 0, MsgPlus.ScriptFilesPath + "\\config\\" + filename + ".ini")
	},
	WriteIni: function(filename, header, key, value) {
		Interop.Call("kernel32", "WritePrivateProfileStringW", header.toString(), key.toString(), value.toString(), MsgPlus.ScriptFilesPath + "\\config\\" + filename + ".ini");
	},
	ReadIni: function(filename, header, key, default_value) {
		cRetVal = Interop.Allocate(2 * (256 + 1));
		lTmp = Interop.Call("kernel32", "GetPrivateProfileStringW", header, key.toString(), default_value.toString(), cRetVal, cRetVal.Size, MsgPlus.ScriptFilesPath + "\\config\\" + filename + ".ini");
		return lTmp === 0 ? default_value : cRetVal.ReadString(0);
	},
	
	ToObject: function(sIniName) {
	//The following ToObject code was taken and modified from http://mpscripts.net/code.php?id=12
		var fso = w32Factory("Scripting.FileSystemObject");
		var data = fso.GetFile(MsgPlus.ScriptFilesPath + "\\config\\" + sIniName + ".ini").OpenAsTextStream(1, - 1).ReadAll();
		var global.ob = {};
		data = data.replace(/^;(.*)$\r\n/gm, "");
		var sectionNames = data.match(/^\[(.*?)\]/gm);
		var sections = data.split(/^\[.*?\]/gm);
		if (sectionNames !== null) {
			for (i = 0; i < sections.length; i++) {
				sectionName = sectionNames[i].replace(/[\[\]]/g, "");
				global.ob[sectionName] = {};
				var v = sections[i].match(/^(.*?)=(.*?)$/gm);
				if (v) {
					for (var x = 0; x < v.length; x++) {
						var sp = v[x].split("=", 2);
						if (sp[1] === "true") {
							sp[1] = true;
						}
						else if (sp[1] === "false") {
							sp[1] = false;
						}
						else if (isFinite(sp[1]) === true) {
							sp[1] = parseFloat(sp[1]);
						}
						global.ob[sectionName][sp[0]] = sp[1];
					}
				}
			}
		}
		return global.ob;
	}
};
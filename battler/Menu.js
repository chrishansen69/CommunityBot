function OnGetScriptMenu(){
	var sMenu="<ScriptMenu>";
	sMenu+="<SubMenu Label=\"Language\">";
	var languages = global.obTrans.TranslationList();
	for(var i in languages) {
		sMenu+="<MenuEntry Id=\""+languages[i]+"\">"+languages[i]+"</MenuEntry>";
	}
	sMenu+="</SubMenu>"; 
	global.obConf.Pref.enabled === true ? 
		sMenu+="<MenuEntry Id=\"Enabled\">"+global.obTrans.GetMenu("Menu").GetString("Disable")+"</MenuEntry>" : 
		sMenu+="<MenuEntry Id=\"Enabled\">"+global.obTrans.GetMenu("Menu").GetString("Enable")+"</MenuEntry>";
	sMenu+="<MenuEntry Id=\"Config\">"+global.obTrans.GetMenu("Menu").GetString("Config")+"</MenuEntry>";
	sMenu+="<MenuEntry Id=\"Shop\">"+global.obTrans.GetMenu("Menu").GetString("Shop")+"</MenuEntry>";
	sMenu+="<MenuEntry Id=\"Equip\">"+global.obTrans.GetMenu("Menu").GetString("Equip")+"</MenuEntry>";
	sMenu+="<MenuEntry Id=\"Mons\">"+global.obTrans.GetMenu("Menu").GetString("Mons")+"</MenuEntry>";
	sMenu+="<MenuEntry Id=\"Moves\">"+global.obTrans.GetMenu("Menu").GetString("Moves")+"</MenuEntry>";
	sMenu+="<MenuEntry Id=\"Commands\">"+global.obTrans.GetMenu("Menu").GetString("Commands")+"</MenuEntry>";
	sMenu+="<MenuEntry Id=\"Reload\">"+global.obTrans.GetMenu("Menu").GetString("Reload")+"</MenuEntry>";
	sMenu+="<MenuEntry Id=\"About\">"+global.obTrans.GetMenu("Menu").GetString("About")+"</MenuEntry>";
	sMenu+="</ScriptMenu>";
	return sMenu;
}

function OnEvent_MenuClicked(MenuID){ // TODO - Missing polyfill
	switch(MenuID){
	case "Enabled": global.obConf.Pref.enabled = global.obConf.Pref.enabled === true ? false : true; break;
	case "Reload": settings.LoadScript(); break;
	case "Config": loadPrefsWnd(configWnd = MsgPlus.CreateWnd("XMLWindows.xml","WndConfig")); break;
	case "Shop":  loadShopWnd(shopWnd = MsgPlus.CreateWnd("XMLWindows.xml","WndShop")); break;
	case "Equip":  loadEquipWnd(equipWnd = MsgPlus.CreateWnd("XMLWindows.xml","WndEquip")); break;
	case "Mons":  loadMonWnd(monWnd = MsgPlus.CreateWnd("XMLWindows.xml","WndMons")); break;
	case "Commands":  loadCmdWnd(cmdWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndCommands")); break;
	case "Moves":  loadMoveWnd(moveWnd = MsgPlus.CreateWnd("XMLWindows.xml","WndMoves")); break;
	case "About": MsgPlus.CreateWnd("XMLWindows.xml","WndAbout"); break;
	default: settings.SetLanguage(MenuID);
	}
}

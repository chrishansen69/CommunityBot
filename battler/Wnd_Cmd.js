function loadCmdWnd(cmdWnd) {
	//Remove current list items
	for(var i = cmdWnd.LstView_GetCount("LvCommands") - 1; i >= 0; i--) {
		cmdWnd.LstView_RemoveItem("LvCommands", i);
	}
	//(Re)populate list
	var i = 0;
	var a = ["ichal", "go", "bhelp", "qq", "return", "use", "heal", "item", "equip", "unequip"];
	for(var p in global.obCmds) {
		cmdWnd.LstView_AddItem("LvCommands", p);
		cmdWnd.LstView_SetItemText("LvCommands", i, 1, a[i]);
		cmdWnd.LstView_SetItemText("LvCommands", i, 2, global.obCmds[p]);
		i++;
	}
}

function OnWndCommandsEvent_CtrlClicked(PlusWnd, ControlId) {
	switch(ControlId) {
	case "BtnEdit":
		//Loop through the list to find the selected item
		for(i = 0; i < PlusWnd.LstView_GetCount("LvCommands"); i++) {
			if(PlusWnd.LstView_GetSelectedState("LvCommands", i) === true) {
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
	switch(ControlId) {
	case "BtnConfirm":
		var sCustom = sanitizeStr(PlusWnd.GetControlText("EdtCustom")).toLowerCase();
		if(sCustom !== "") {
			iniIntf.WriteIni("settings", "Commands", PlusWnd.GetControlText("EdtCmd"), sCustom);
		}
		PlusWnd.Close(1);
		settings.LoadFile.Cmd();
		loadCmdWnd(cmdWnd);
		break;
	}
}

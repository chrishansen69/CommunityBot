function loadMonWnd(monWnd) {
	//Remove current list items
	for(i = monWnd.LstView_GetCount("LvMons") - 1; i >= 0; i--) {
		monWnd.LstView_RemoveItem("LvMons", i);
	}
	//(Re)populate list
	i = 0;
	for(sName in global.obMonParty) {
		monWnd.LstView_AddItem("LvMons", global.obMonParty[sName].Name); 
		monWnd.LstView_SetItemText("LvMons", i, 1, global.obTrans.Types().GetString(global.obMonParty[sName].Type[0]) + (global.obMonParty[sName].Type[1] === undefined ? "" : ("," + global.obTrans.Types().GetString(global.obMonParty[sName].Type[1]))));
		monWnd.LstView_SetItemText("LvMons", i, 2, global.obMonParty[sName].HPCur + "\/" + global.obMonParty[sName].HPMax);
		monWnd.LstView_SetItemText("LvMons", i, 3, global.obMonParty[sName].Atk);
		monWnd.LstView_SetItemText("LvMons", i, 4, global.obMonParty[sName].Def);
		monWnd.LstView_SetItemText("LvMons", i, 5, global.obMonParty[sName].Spe);
		monWnd.LstView_SetItemText("LvMons", i, 6, global.obMonParty[sName].Spc);
		monWnd.LstView_SetItemText("LvMons", i, 7, global.obMonParty[sName].Enabled);
		i++;
	}
}

function loadEditMonWnd(PlusWnd, sMonName) {
	PlusWnd.Combo_AddItem("CbType1", "-", - 1);
	for(i = 0; i < aTypeMatchup.length; i++) {
		PlusWnd.Combo_AddItem("CbType0", global.obTrans.Types().GetString(i));
		PlusWnd.Combo_AddItem("CbType1", global.obTrans.Types().GetString(i));
	}
	if(global.obMonParty[sMonName] !== undefined) {
		PlusWnd.Combo_SetCurSel("CbType0", global.obMonParty[sMonName].Type[0]);
		PlusWnd.Combo_SetCurSel("CbType1", (global.obMonParty[sMonName].Type[1] === undefined ? 0 : global.obMonParty[sMonName].Type[1] + 1));
		for(v in a = ["Name", "Atk", "Def", "Spe", "Spc", "HPMax"]) {
			PlusWnd.SetControlText("Edt" + a[v], global.obMonParty[sMonName][a[v]]);
		}
	} else {
		PlusWnd.Combo_SetCurSel("CbType0", 0);
		PlusWnd.Combo_SetCurSel("CbType1", 0);
	}
}

function OnWndMonsEvent_CtrlClicked(monWnd, ControlId) {
	switch(ControlId) {
	case "BtnDelete":
		//Loop through the list to find the selected item
		for(i = 0; i < monWnd.LstView_GetCount("LvMons"); i++) {
			if(monWnd.LstView_GetSelectedState("LvMons", i) === true) {
				iniIntf.DeleteHeader("monParty", monWnd.LstView_GetItemText("LvMons", i, 0));
				settings.LoadFile.Mon();
				loadMonWnd(monWnd);
				break;
			}
		}
		break;
	case "BtnEdit":
		//Loop through the list to find the selected item
		for(i = 0; i < monWnd.LstView_GetCount("LvMons"); i++) {
			if(monWnd.LstView_GetSelectedState("LvMons", i) === true) {
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
		for(i = 0; i <= monWnd.LstView_GetCount("LvMons"); i++) {
			if(monWnd.LstView_GetSelectedState("LvMons", i) === true) {
				name = monWnd.LstView_GetItemText("LvMons", i, 0);
				iniIntf.WriteIni("monParty", name, "Enabled", (global.obMonParty[name].Enabled === false) ? true : false);
				settings.LoadFile.Mon();
				loadMonWnd(monWnd);
				break;
			}
		}
		break;
	}
}

function OnWndEditMonEvent_CtrlClicked(PlusWnd, ControlId) {
	switch(ControlId) {
	case "BtnConfirm":
		monName = sanitizeStr(PlusWnd.GetControlText("EdtName")).toLowerCase();
		if(monName !== "") {
			iniIntf.WriteIni("monParty", monName, "Name", monName);
			iniIntf.WriteIni("monParty", monName, "Type", PlusWnd.Combo_GetCurSel("CbType0") + (PlusWnd.Combo_GetCurSel("CbType1") === 0 ? "" : "," + (PlusWnd.Combo_GetCurSel("CbType1") - 1)));
			for(v in a = ["Atk", "Def", "Spe", "Spc", "HPMax"]) {
				if(isFinite(PlusWnd.GetControlText("Edt" + a[v]))) {
					iniIntf.WriteIni("monParty", monName, a[v], PlusWnd.GetControlText("Edt" + a[v]));
				} else {
					iniIntf.WriteIni("monParty", monName, a[v], 100);
				}
			}
			iniIntf.WriteIni("monParty", monName, "HPCur", - 1);
			iniIntf.WriteIni("monParty", monName, "Status", - 1);
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
	iniIntf.WriteIni("monParty", sName, "Enabled", (global.obMonParty[sName].Enabled === false) ? true : false);
	settings.LoadFile.Mon();
	loadMonWnd(monWnd);
}

function OnWndMonsEvent_LstViewDblClicked(PlusWnd, ControlId, ItemIdx) {
	loadEditMonWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditMon"), PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0));
}
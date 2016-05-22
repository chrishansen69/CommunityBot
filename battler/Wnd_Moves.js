//Equip
function loadMoveWnd(moveWnd) {
	//Remove current list items
	for(i = moveWnd.LstView_GetCount("LvMoves") - 1; i >= 0; i--) {
		moveWnd.LstView_RemoveItem("LvMoves", i);
	}
	//(Re)populate list
	i = 0;
	for(sName in global.obMoveDB) {
		moveWnd.LstView_AddItem("LvMoves", sName);
		moveWnd.LstView_SetItemText("LvMoves", i, 1, global.obTrans.Types().GetString(global.obMoveDB[sName].Type));
		moveWnd.LstView_SetItemText("LvMoves", i, 2, global.obMoveDB[sName].Pwr);
		moveWnd.LstView_SetItemText("LvMoves", i, 3, global.obMoveDB[sName].Acc);
		moveWnd.LstView_SetItemText("LvMoves", i, 4, global.obMoveDB[sName].Eff);
		i++;
	}
}
function OnWndMovesEvent_CtrlClicked(moveWnd, ControlId) {
	switch(ControlId) {
	case "BtnDelete":
		//Loop through the list to find the selected item
		for(i = 0; i < moveWnd.LstView_GetCount("LvMoves"); i++) {
			if(moveWnd.LstView_GetSelectedState("LvMoves", i) === true) {
				iniIntf.DeleteHeader("moveDB", moveWnd.LstView_GetItemText("LvMoves", i, 0));
				settings.LoadFile.Move();
				loadMoveWnd(moveWnd);
				break;
			}
		}
		break;
	case "BtnEdit":
		//Loop through the list to find the selected item
		for(i = 0; i < moveWnd.LstView_GetCount("LvMoves"); i++) {
			if(moveWnd.LstView_GetSelectedState("LvMoves", i) === true) {
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
		for(i = 0; i <= moveWnd.LstView_GetCount("LvMons"); i++) {
			if(moveWnd.LstView_GetSelectedState("LvMons", i) === true) {
				name = moveWnd.LstView_GetItemText("LvMons", i, 0);
				iniIntf.WriteIni("moveDB", name, "Enabled", (global.obMoveDB[name].Enabled === false) ? true : false);
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
	iniIntf.WriteIni("moveDB", sName, "Enabled", (global.obMoveDB[sName].Enabled === false) ? true : false);
	settings.LoadFile.Move();
	loadMoveWnd(moveWnd);
}

function OnWndMovesEvent_LstViewDblClicked(PlusWnd, ControlId, ItemIdx) {
	loadEditMoveWnd(MsgPlus.CreateWnd("XMLWindows.xml", "WndEditMove"), PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0));
}

function loadEditMoveWnd(PlusWnd, sMoveName) {
	for(i = 0; i < global.aTypeMatchup.length; i++) {
		PlusWnd.Combo_AddItem("CbType", global.obTrans.Types().GetString(i));
	}
	if(global.obMoveDB[sMoveName] !== undefined) {
		PlusWnd.Combo_SetCurSel("CbType", global.obMoveDB[sMoveName].Type);
		PlusWnd.SetControlText("EdtName", sMoveName);
		for(v in a = ["Acc", "Pwr", "Eff"]) {
			PlusWnd.SetControlText("Edt" + a[v], global.obMoveDB[sMoveName][a[v]]);
		}
	} else {
		PlusWnd.Combo_SetCurSel("CbType", 0);
	}
}

function OnWndEditMoveEvent_CtrlClicked(PlusWnd, ControlId) {
	switch(ControlId) {
	case "BtnConfirm":
		sMoveName = sanitizeStr(PlusWnd.GetControlText("EdtName")).toLowerCase();
		if(sMoveName !== "") {
			iniIntf.WriteIni("moveDB", sMoveName, "Name", sMoveName);
			iniIntf.WriteIni("moveDB", sMoveName, "Type", PlusWnd.Combo_GetCurSel("CbType"));
			for(v in a = ["Acc", "Pwr"]) {
				if(isFinite(PlusWnd.GetControlText("Edt" + a[v]))) {
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

//Equip
function loadEquipWnd(equipWnd) {
	//Remove current list items
	for(i = equipWnd.LstView_GetCount("LvEquip") - 1; i >= 0; i--) {
		equipWnd.LstView_RemoveItem("LvEquip", i);
	}
	//(Re)populate list
	i = 0;
	for(sName in global.obEquipDB) {
		equipWnd.LstView_AddItem("LvEquip", sName);
		equipWnd.LstView_SetItemText("LvEquip", i, 1, global.obEquipDB[sName].Desc);
		equipWnd.LstView_SetItemText("LvEquip", i, 2, global.obEquipDB[sName].Enabled);
		i++;
	}
}

function OnWndEquipEvent_CtrlClicked(equipWnd, ControlId) {
	switch(ControlId) {
	case "BtnAdd":
		addEquipWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndAddEquip");
		//Populate dropdown menus
		for(var i = -2; i <= 6; i++) {
			addEquipWnd.Combo_AddItem("CbSts", global.obTrans.GetWindow("WndAddEquip").GetString("CbSts" + i), i);
		}
		for(var i = -2; i <= -1; i++) {
			addEquipWnd.Combo_AddItem("CbImm", global.obTrans.GetWindow("WndAddEquip").GetString("CbImm" + i), i);
		}
		for(var i = 0; i <= 6; i++) {
			addEquipWnd.Combo_AddItem("CbImm", global.obTrans.GetWindow("WndAddEquip").GetString("CbSts" + i), i);
		}
		addEquipWnd.Combo_SetCurSel("CbSts", 0);
		addEquipWnd.Combo_SetCurSel("CbImm", 0);
		break;
	case "BtnDelete":
		//Loop through the list to find the selected item
		for(var i = 0; i <= equipWnd.LstView_GetCount("LvEquip"); i++) {
			if(equipWnd.LstView_GetSelectedState("LvEquip", i) === true) {
				iniIntf.DeleteHeader("equipDB", equipWnd.LstView_GetItemText("LvEquip", i, 0));
				settings.LoadFile.Equip();
				loadEquipWnd(equipWnd);
				break;
			}
		}
		break;
	case "BtnEnable":
		//Loop through the list to find the selected item
		for(var i = 0; i <= equipWnd.LstView_GetCount("LvEquip"); i++) {
			if(equipWnd.LstView_GetSelectedState("LvEquip", i) === true) {
				name = equipWnd.LstView_GetItemText("LvEquip", i, 0);
				iniIntf.WriteIni("equipDB", name, "Enabled", (global.obEquipDB[name].Enabled === false) ? true : false);
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
	switch(ControlId) {
	case "BtnConfirm":
		var addEquipEff = "";
		var arEdt = ["EdtAbsMod0", "EdtAbsMod1", "EdtAbsMod2", "EdtAbsMod3", "EdtRelMod0", "EdtRelMod1", "EdtRelMod2", "EdtRelMod3", "EdtPerMod0", "EdtPerMod1", "EdtPerMod2", "EdtPerMod3"];
		var arMod = ["a0", "a1", "a2", "a3", "m0", "m1", "m2", "m3", "p0", "p1", "p2", "p3"];
		var i = 0;
		while(i < 12) {
			j = parseInt(addEquipWnd.GetControlText(arEdt[i]), 10);
			addEquipEff += (isNaN(j) === true || j === 0) ? "" : (arMod[i] + (j > 0 ? "+" : "") + j);
			i++;
		}
		i = addEquipWnd.Combo_GetItemData("CbImm", addEquipWnd.Combo_GetCurSel("CbImm"));
		addEquipEff += (i !== -2) ? "i" + i : "";
		i = addEquipWnd.Combo_GetItemData("CbSts", addEquipWnd.Combo_GetCurSel("CbSts"));
		switch(i) {
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
	iniIntf.WriteIni("equipDB", sName, "Enabled", (global.obEquipDB[sName].Enabled === false) ? true : false);
	settings.LoadFile.Equip();
	loadEquipWnd(equipWnd);
}
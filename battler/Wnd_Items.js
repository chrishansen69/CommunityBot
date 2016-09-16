function loadShopWnd(shopWnd) {
  //Remove current list items
  for(i = shopWnd.LstView_GetCount('LvItems'); i >= 0; i--) {
    shopWnd.LstView_RemoveItem('LvItems', i);
  }
  //(Re)populate list
  i = 0;
  for(sName in global.obItemDB) {
    shopWnd.LstView_AddItem('LvItems', sName);
    shopWnd.LstView_SetItemText('LvItems', i, 1, global.obItemDB[sName].Desc);
    shopWnd.LstView_SetItemText('LvItems', i, 2, global.obItemDB[sName].Enabled);
    i++;
  }
}

function OnWndShopEvent_CtrlClicked(shopWnd, ControlId) {
  switch(ControlId) {
  case 'BtnAdd':
    addItemWnd = MsgPlus.CreateWnd('XMLWindows.xml', 'WndAddItem');
    //Populate dropdown menus
    for(i = -2; i <= 6; i++) {
      addItemWnd.Combo_AddItem('CbSts', global.obTrans.GetWindow('WndAddItem').GetString('CbSts' + i), i);
    }
    for(i = 0; i <= 2; i++) {
      addItemWnd.Combo_AddItem('CbResHP', global.obTrans.GetWindow('WndAddItem').GetString('CbHP' + i), i);
    }
    addItemWnd.Combo_SetCurSel('CbSts', 0);
    addItemWnd.Combo_SetCurSel('CbResHP', 0);
    break;
  case 'BtnDelete':
    //Loop through the list to find the selected item
    for(i = 0; i <= shopWnd.LstView_GetCount('LvItems'); i++) {
      if(shopWnd.LstView_GetSelectedState('LvItems', i) === true) {
        iniIntf.DeleteHeader('itemDB', shopWnd.LstView_GetItemText('LvItems', i, 0));
        settings.LoadFile.Item();
        loadShopWnd(shopWnd);
        break;
      }
    }
    break;
  case 'BtnEnable':
    //Loop through the list to find the selected item
    for(i = 0; i <= shopWnd.LstView_GetCount('LvItems'); i++) {
      if(shopWnd.LstView_GetSelectedState('LvItems', i) === true) {
        name = shopWnd.LstView_GetItemText('LvItems', i, 0);
        iniIntf.WriteIni('itemDB', name, 'Enabled', (global.obItemDB[name].Enabled === false) ? true : false);
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
  switch(ControlId) {
  case 'BtnConfirm':
    var addItemEff = '';
    //Stat mods
    var arEdt = ['EdtAbsMod0', 'EdtAbsMod1', 'EdtAbsMod2', 'EdtAbsMod3', 'EdtRelMod0', 'EdtRelMod1', 'EdtRelMod2', 'EdtRelMod3', 'EdtPerMod0', 'EdtPerMod1', 'EdtPerMod2', 'EdtPerMod3'];
    var arMod = ['a0', 'a1', 'a2', 'a3', 'm0', 'm1', 'm2', 'm3', 'p0', 'p1', 'p2', 'p3'];
    i=0;
    while(i < 12) {
      j = parseInt(addItemWnd.GetControlText(arEdt[i]), 10);
      addItemEff += (isNaN(j) === true || j === 0) ? '' : (arMod[i] + (j > 0 ? '+' : '') + j);
      i++;
    }
    //Healing
    j = parseInt(addItemWnd.GetControlText('EdtHPAmt'), 10);
    if(isFinite(j) === true) {
      i = addItemWnd.Combo_GetItemData('CbResHP', addItemWnd.Combo_GetCurSel('CbResHP'));
      j = (i === 2 && t > 100) ? 100 : j;
      addItemEff += 'h' + (i === 2 ? '1' : '0') + j;
    }
    //Status
    i = addItemWnd.Combo_GetItemData('CbSts', addItemWnd.Combo_GetCurSel('CbSts'));
    switch(i) {
    case -2:
      break;
    case -1:
      addItemEff += 'c';
      break;
    default:
      addItemEff += 's' + i;
    }
    name = sanitizeStr(addItemWnd.GetControlText('EdtName')).toLowerCase();
    iniIntf.WriteIni('itemDB', name, 'Effect', addItemEff);
    iniIntf.WriteIni('itemDB', name, 'Desc', sanitizeStr(addItemWnd.GetControlText('EdtDesc')));
    iniIntf.WriteIni('itemDB', name, 'Enabled', true);
    addItemWnd.Close(1);
    settings.LoadFile.Item();
    loadShopWnd(shopWnd);
    break;
  }
}

function OnWndShopEvent_LstViewRClicked(PlusWnd, ControlId, ItemIdx) {
  sName = PlusWnd.LstView_GetItemText(ControlId, ItemIdx, 0);
  iniIntf.WriteIni('itemDB', sName, 'Enabled', (global.obItemDB[sName].Enabled === false) ? true : false);
  settings.LoadFile.Item();
  loadShopWnd(shopWnd);
}

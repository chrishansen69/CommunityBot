function useItem(Player, itemName, itemEff) {
  var oMon = Player.Mon;
  sendMsg(global.obTrans.GetMessages().GetString('ItemUsed').replace(/PLAYER_NAME/, Player.Name).replace(/ITEM_NAME/, itemName.toUpperCase()));
  var a = itemEff.match(/([amp]\d[\+\-]\d*)|(h\d*)|c|s\d*/gi);
  for (i = 0; i < a.length; i++) {
    switch (a[i].charAt(0)) {
    case 'a':
      statMod.Set.Absolute(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
      break;
    case 'm':
      statMod.Set.Relative(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
      break;
    case 'p':
      statMod.Set.Percent(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
      break;
    case 'h':
      i = a[i].charAt(1) === '0' ? Math.ceil(parseInt(a[i].slice(2), 10) * oMon.HPMax / 100) : parseInt(a[i].slice(2), 10);
      oMon.HPCur + i > oMon.HPMax ? oMon.HPCur = oMon.HPMax : oMon.HPCur += i;
      sendMsg(global.obTrans.GetMessages().GetString('HealSuccess').replace(/MON_NAME/, oMon.Name).replace(/NUMBER/, i));
      displayHP(oMon);
      break;
    case 'c':
      oMon.Status.ID = -1;
      sendMsg(global.obTrans.GetMessages().GetString('StatusCured').replace(/MON_NAME/, oMon.Name));
      break;
    case 's':
      status.Set(oMon, parseInt(a[i].charAt(1)));
      break;
    }
  }
  status.EndCheck(oMon);
  changeTurn(global.bWnd[global.iWnd].Turn, oMon, global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn === 1 ? 2 : 1].Mon);
}

function equipItem(oMon, itemName, itemEff, itemMsg) {
  if (oMon.Equip.Name === '') {
    oMon.Equip.Name = itemName;
    oMon.Equip.Eff = itemEff;
    sendMsg(global.obTrans.GetMessages().GetString('ItemEquipped').replace(/MON_NAME/, oMon.Name).replace(/ITEM_NAME/, itemName.toUpperCase()) + ' ' + itemMsg);
    var a = itemEff.match(/[amp]\d[\+\-]\d*|s\d*/gi);
    if(a !== null){
      for (var i = 0; i < a.length; i++) {
        switch (a[i].charAt(0)) {
        case 'a':
          statMod.Set.Absolute(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
          break;
        case 'm':
          statMod.Set.Relative(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
          break;
        case 'p':
          statMod.Set.Percent(oMon, parseInt(a[i].charAt(1), 10), parseInt(a[i].slice(2), 10));
          break;
        case 's':
          status.Set(oMon, parseInt(a[i].charAt(1)));
          break;
        }
      }
    }
    changeTurn(global.bWnd[global.iWnd].Turn, oMon, global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn === 1 ? 2 : 1].Mon);
  }
  else {
    sendMsg(global.obTrans.GetMessages().GetString('AlreadyEquipped'));
  }
}

function unequipItem(oMon) {
  if (oMon.Equip.Name !== '') {
    sendMsg(global.obTrans.GetMessages().GetString('ItemUnequipped').replace(/MON_NAME/, oMon.Name).replace(/ITEM_NAME/, oMon.Equip.Name.toUpperCase()));
    //Reverse stat changes
    a = oMon.Equip.Eff.match(/[amp]\d[\+\-]\d*/gi);
    if(a !== null){
      for (i = 0; i < a.length; i++) {
        switch (a[i].charAt(0)) {
        case 'a':
          statMod.Set.Absolute(oMon, parseInt(a[i].charAt(1), 10), - parseInt(a[i].slice(2), 10));
          break;
        case 'm':
          statMod.Set.Relative(oMon, parseInt(a[i].charAt(1), 10), - parseInt(a[i].slice(2), 10));
          break;
        case 'p':
          statMod.Set.Percent(oMon, parseInt(a[i].charAt(1), 10), - parseInt(a[i].slice(2), 10));
          break;
        }
      }
    }
    oMon.Equip.Name = '';
    oMon.Equip.Eff = '';
  }
  else {
    sendMsg(global.obTrans.GetMessages().GetString('NoEquip'));
  }
}

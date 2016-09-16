function OnWndConfigEvent_CtrlClicked(confWnd, ControlId) {
  switch (ControlId) {
  case 'BtnSave':
    saveConfig(confWnd);
    //confWnd.Close(1);
    break;
  case 'BtnDefault':
    confWnd.Button_SetCheckState('ChkHeal', true);
    confWnd.Button_SetCheckState('ChkQuit', true);
    confWnd.Button_SetCheckState('ChkReturn', true);
    confWnd.Button_SetCheckState('ChkTypes', true);
    confWnd.Button_SetCheckState('ChkMoveDB', false);
    confWnd.Button_SetCheckState('ChkItem', true);
    confWnd.Button_SetCheckState('ChkEquip', true);
    confWnd.Button_SetCheckState('ChkCustomGo', true);
    confWnd.Button_SetCheckState('ChkDisplayTypes', true);
    confWnd.Button_SetCheckState('ChkMustBePokemon', false);
    confWnd.Button_SetCheckState('ChkMoveDBOnly', false);
    confWnd.SetControlText('EdtstatOcc', 10);
    confWnd.SetControlText('EdtmodOcc', 10);
    confWnd.SetControlText('EdtflinchOcc', 5);
    confWnd.SetControlText('EdtcritOcc', 10);
    confWnd.SetControlText('EdtmissOcc', 8);
    confWnd.SetControlText('EdtcureOcc', 75);
    confWnd.SetControlText('EdtstripOcc', 10);
    confWnd.SetControlText('EdtrecoilOcc', 2);
    confWnd.SetControlText('EdtFormatting', '$MSG');
    confWnd.SetControlText('EdtHPMin', 400);
    confWnd.SetControlText('EdtHPMax', 500);
    confWnd.SetControlText('EdtAtkMin', 100);
    confWnd.SetControlText('EdtAtkMax', 200);
    confWnd.SetControlText('EdtDefMin', 100);
    confWnd.SetControlText('EdtDefMax', 200);
    confWnd.SetControlText('EdtSpeMin', 100);
    confWnd.SetControlText('EdtSpeMax', 200);
    confWnd.SetControlText('EdtSpcMin', 100);
    confWnd.SetControlText('EdtSpcMax', 200);
    break;
  case 'ChkMustBePokemon':
    if (confWnd.Button_IsChecked('ChkMustBePokemon') === true) {
      confWnd.Button_SetCheckState('ChkCustomGo', false);
    }
    break;
  case 'ChkCustomGo':
    if (confWnd.Button_IsChecked('ChkCustomGo') === true) {
      confWnd.Button_SetCheckState('ChkMustBePokemon', false);
    }
    break;
  case 'ChkMoveDBOnly':
    if (confWnd.Button_IsChecked('ChkMoveDBOnly') === true) {
      confWnd.Button_SetCheckState('ChkMoveDB', true);
    }
    break;
  case 'ChkMoveDB':
    if (confWnd.Button_IsChecked('ChkMoveDB') === false) {
      confWnd.Button_SetCheckState('ChkMoveDBOnly', false);
    }
    break;
  case 'ChkTypes':
    if (confWnd.Button_IsChecked('ChkTypes') === false) {
      confWnd.Button_SetCheckState('ChkDisplayTypes', false);
    }
    break;
  case 'ChkDisplayTypes':
    if (confWnd.Button_IsChecked('ChkDisplayTypes') === true) {
      confWnd.Button_SetCheckState('ChkTypes', true);
    }
    break;
  }
}

function loadPrefsWnd(confWnd) {

  confWnd.SetControlText('EdtFormatting', global.obConf.Pref.msgFormat[0] + '$MSG' + global.obConf.Pref.msgFormat[1]);
  
  confWnd.Button_SetCheckState('ChkHeal', global.obConf.Pref.healOn);
  confWnd.Button_SetCheckState('ChkQuit', global.obConf.Pref.quitOn);
  confWnd.Button_SetCheckState('ChkReturn', global.obConf.Pref.returnOn);
  confWnd.Button_SetCheckState('ChkTypes', global.obConf.Pref.typesOn);
  confWnd.Button_SetCheckState('ChkMoveDB',global.obConf.Pref.moveDBOn);
  confWnd.Button_SetCheckState('ChkItem', global.obConf.Pref.itemOn);
  confWnd.Button_SetCheckState('ChkEquip', global.obConf.Pref.equipOn);
  confWnd.Button_SetCheckState('ChkCustomGo', global.obConf.Pref.customGoOn);
  confWnd.Button_SetCheckState('ChkDisplayTypes', global.obConf.Pref.displayTypesOn);
  confWnd.Button_SetCheckState('ChkMustBePokemon', global.obConf.Pref.mustBePokemonOn);
  confWnd.Button_SetCheckState('ChkMoveDBOnly', global.obConf.Pref.moveDBOnlyOn);
  
  confWnd.SetControlText('EdtstatOcc', global.obConf.OccRate.status * 100);
  confWnd.SetControlText('EdtmodOcc', global.obConf.OccRate.mod * 100);
  confWnd.SetControlText('EdtflinchOcc', global.obConf.OccRate.flinch * 100);
  confWnd.SetControlText('EdtcritOcc', global.obConf.OccRate.crit * 100);
  confWnd.SetControlText('EdtrecoilOcc', global.obConf.OccRate.recoil * 100);
  confWnd.SetControlText('EdtmissOcc', global.obConf.OccRate.miss * 100);
  confWnd.SetControlText('EdtcureOcc', global.obConf.OccRate.cure * 100);
  confWnd.SetControlText('EdtstripOcc', global.obConf.OccRate.strip * 100);
  confWnd.SetControlText('EdtrecoilOcc', global.obConf.OccRate.recoil * 100);
  
  confWnd.SetControlText('EdtHPMin', global.obConf.Stat.HPMin);
  confWnd.SetControlText('EdtHPMax', global.obConf.Stat.HPMax);
  confWnd.SetControlText('EdtAtkMin', global.obConf.Stat.AtkMin);
  confWnd.SetControlText('EdtAtkMax', global.obConf.Stat.AtkMax);
  confWnd.SetControlText('EdtDefMin', global.obConf.Stat.DefMin);
  confWnd.SetControlText('EdtDefMax', global.obConf.Stat.DefMax);
  confWnd.SetControlText('EdtSpeMin', global.obConf.Stat.SpeMin);
  confWnd.SetControlText('EdtSpeMax', global.obConf.Stat.SpeMax);
  confWnd.SetControlText('EdtSpcMin', global.obConf.Stat.SpcMin);
  confWnd.SetControlText('EdtSpcMax', global.obConf.Stat.SpcMax);
}

function saveConfig(confWnd) {
  settings.Save('Pref', 'typesOn', confWnd.Button_IsChecked('ChkTypes'));
  settings.Save('Pref', 'healOn', confWnd.Button_IsChecked('ChkHeal'));
  settings.Save('Pref', 'returnOn', confWnd.Button_IsChecked('ChkReturn'));
  settings.Save('Pref', 'quitOn', confWnd.Button_IsChecked('ChkQuit'));
  settings.Save('Pref', 'moveDBOn', confWnd.Button_IsChecked('ChkMoveDB'));
  settings.Save('Pref', 'itemOn', confWnd.Button_IsChecked('ChkItem'));
  settings.Save('Pref', 'equipOn', confWnd.Button_IsChecked('ChkEquip'));
  settings.Save('Pref', 'customGoOn', confWnd.Button_IsChecked('ChkCustomGo'));
  settings.Save('Pref', 'displayTypesOn', confWnd.Button_IsChecked('ChkDisplayTypes'));
  settings.Save('Pref', 'mustBePokemonOn', confWnd.Button_IsChecked('ChkMustBePokemon'));
  settings.Save('Pref', 'moveDBOnlyOn', confWnd.Button_IsChecked('ChkMoveDBOnly'));
  
  settings.Save('Stat', 'HPMin', confWnd.GetControlText('EdtHPMin'), true);
  settings.Save('Stat', 'HPMax', confWnd.GetControlText('EdtHPMax'), true);
  settings.Save('Stat', 'AtkMin', confWnd.GetControlText('EdtAtkMin'), true);
  settings.Save('Stat', 'AtkMax', confWnd.GetControlText('EdtAtkMax'), true);
  settings.Save('Stat', 'DefMin', confWnd.GetControlText('EdtDefMin'), true);
  settings.Save('Stat', 'DefMax', confWnd.GetControlText('EdtDefMax'), true);
  settings.Save('Stat', 'SpeMin', confWnd.GetControlText('EdtSpeMin'), true);
  settings.Save('Stat', 'SpeMax', confWnd.GetControlText('EdtSpeMax'), true);
  settings.Save('Stat', 'SpcMin', confWnd.GetControlText('EdtSpcMin'), true);
  settings.Save('Stat', 'SpcMax', confWnd.GetControlText('EdtSpcMax'), true);
  
  settings.Save('OccRate', 'status', confWnd.GetControlText('EdtstatOcc'), true);
  settings.Save('OccRate', 'crit', confWnd.GetControlText('EdtcritOcc'), true);
  settings.Save('OccRate', 'mod', confWnd.GetControlText('EdtmodOcc'), true);
  settings.Save('OccRate', 'miss', confWnd.GetControlText('EdtmissOcc'), true);
  settings.Save('OccRate', 'flinch', confWnd.GetControlText('EdtflinchOcc'), true);
  settings.Save('OccRate', 'cure', confWnd.GetControlText('EdtcureOcc'), true);
  settings.Save('OccRate', 'recoil', confWnd.GetControlText('EdtrecoilOcc'), true);
  settings.Save('OccRate', 'strip', confWnd.GetControlText('EdtstripOcc'), true);
  
  str = confWnd.GetControlText('EdtFormatting');
  match = str.match(/\$MSG/g);
  if(match !== null && match.length === 1){
    settings.Save('Pref', 'msgFormat', str);
  }
  
  settings.LoadFile.Conf();
  loadPrefsWnd(confWnd);
}
function OnGetScriptCommands(){

  var ScriptCommands = '<ScriptCommands>';
  ScriptCommands    +=     '<Command>';
  ScriptCommands    +=         '<Name>battler</Name>';
  ScriptCommands    +=         '<Description>Toggle enabled status</Description>';
  ScriptCommands    +=     '</Command>';
  ScriptCommands    +=     '<Command>';
  ScriptCommands    +=         '<Name>battlerprefs</Name>';
  ScriptCommands    +=         '<Description>Open config window</Description>';
  ScriptCommands    +=     '</Command>';
  ScriptCommands    +=     '<Command>';
  ScriptCommands    +=         '<Name>battleritems</Name>';
  ScriptCommands    +=         '<Description>View items</Description>';
  ScriptCommands    +=     '</Command>';
  ScriptCommands    +=     '<Command>';
  ScriptCommands    +=         '<Name>battlerequip</Name>';
  ScriptCommands    +=         '<Description>View equipment</Description>';
  ScriptCommands    +=     '</Command>';
  ScriptCommands    +=     '<Command>';
  ScriptCommands    +=         '<Name>battlerrecord</Name>';
  ScriptCommands    +=         '<Description>Send Battler wins\/losses\/quits record</Description>';
  ScriptCommands    +=     '</Command>';
  ScriptCommands    +=     '<Command>';
  ScriptCommands    +=         '<Name>dmg</Name>';
  ScriptCommands    +=         '<Description>Change damage of next attack</Description>';
  ScriptCommands    +=     '<Parameters>&lt;number&gt;</Parameters>';
  ScriptCommands    +=     '</Command>';
  ScriptCommands    +=     '<Command>';
  ScriptCommands    +=         '<Name>battlermons</Name>';
  ScriptCommands    +=         '<Description>View custom Mons</Description>';
  ScriptCommands    +=     '</Command>';
  ScriptCommands    +=     '<Command>';
  ScriptCommands    +=         '<Name>battlermoves</Name>';
  ScriptCommands    +=         '<Description>View the moves list</Description>';
  ScriptCommands    +=     '</Command>';
  ScriptCommands    +=     '<Command>';
  ScriptCommands    +=         '<Name>battlercmds</Name>';
  ScriptCommands    +=         '<Description>Edit commands</Description>';
  ScriptCommands    +=     '</Command>';
  // ScriptCommands    +=     "<Command>";
  // ScriptCommands    +=         "<Name>battlerupdate</Name>";
  // ScriptCommands    +=         "<Description>Check for updates for Battler</Description>";
  // ScriptCommands    +=     "</Command>";
  // ScriptCommands    +=     "<Command>";
  // ScriptCommands    +=         "<Name>battlershare</Name>";
  // ScriptCommands    +=         "<Description>Share with your friends</Description>";
  // ScriptCommands    +=     "</Command>";
  ScriptCommands    += '</ScriptCommands>';

  return ScriptCommands;

}

function OnWndAboutEvent_CtrlClicked(aboutWnd,ControlId){
 switch(ControlId){
  case "SiteLink": openPage("http://apotah.zxq.net/battler/"); break;
 }
}
function openPage(sLink) {
	shell = new ActiveXObject("WScript.Shell");
	shell.run(sLink);
}
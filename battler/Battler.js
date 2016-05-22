//Battler - Battles with MSN, inspired by Pokemon.
//Created by Apotah, <apotah@hotmail.com>.
//Version 5.02, <2012 October 22>.
// http://apotah.zxq.net/battler/

function OnEvent_ChatWndReceiveMessage(ChatWnd, Origin, Message, MsgKind) { // TODO - Missing polyfill

	if (global.obConf.Pref.enabled === false) {return;}
	
	Message = Message.toLowerCase();
	
	//determine which chat window is being used for the battle; diff chat wnds = diff battles
	for (i = 0; i <= global.bWnd.length + 1; i++) {
		//if there's a battle in the window that just received a msg, global.iWnd = that battle's pos. in global.bWnd
		if (global.bWnd[i] !== undefined && global.bWnd[i].Wnd === ChatWnd) {
			global.iWnd = i;
			if (Message.substr(0,5) === "ichal" || Message.substr(0, global.obCmds.Fight.length) === global.obCmds.Fight) {
				sendMsg(global.obTrans.GetMessages().GetString("IChalFail"));
				return;
			}
			break;
		}
		//if there's no battle, i = the last empty pos. in global.bWnd
		else if (global.bWnd[i] === undefined) {
			global.iWnd = i;
			//check if the sender actually wanted to start a battle
			if (Message.substr(0,5) === "ichal" || Message.substr(0, global.obCmds.Fight.length) === global.obCmds.Fight) {
				global.bWnd[global.iWnd] = {
					"Wnd": ChatWnd,
					"Turn": 0,
					"Return": 0,
					Player: [null, {"Name": Origin}, {}]
				};
				sendMsg(global.obTrans.GetMessages().GetString("IChalSuccess").replace(/PLAYER_NAME/g, Origin));
			}
			return;
		}
	}
	
	if (Message === "bhelp" || Message === global.obCmds.Help) {
		sendMsg(global.obTrans.GetMessages().GetString("BHelp").replace(/SCRIPT_VERSION/g, global.obConf.Version.current));
	}
	
	else if ((Message === "qq" || Message === global.obCmds.Quit) && (global.bWnd[global.iWnd].Player[1].Name === Origin || global.bWnd[global.iWnd].Player[2].Name === Origin)) {
		if (global.obConf.Pref.quitOn === false) {
			sendMsg(global.obTrans.GetMessages().GetString("QuitDisabled"));
		}
		else {
			sendMsg(global.obTrans.GetMessages().GetString("Quit").replace(/PLAYER_NAME/g, Origin));
			global.bWnd.splice(global.iWnd, 1);
			if (Origin === Messenger.MyName) {
				settings.UpdateRecord("quit");
			}
		}
	}
	
	else if ((Message.substr(0,2) === "go" && Message.substr(0, global.obCmds.Go.length) !== global.obCmds.Go) || Message.substr(0, global.obCmds.Go.length) === global.obCmds.Go) {
	
		var extractStrFrom = 3;
		var	isCustomMon = false;
		if(Message.substr(0, global.obCmds.Go.length) === global.obCmds.Go){
			extractStrFrom = global.obCmds.Go.length + 1;
			if(Message.charAt(global.obCmds.Go.length) === "!"){
				extractStrFrom += 1;
				isCustomMon = true;
			}
		}
		else if(Message.charAt(2) === "!"){
			extractStrFrom = 4;
			isCustomMon = true;
		}
		strName = Message.substr(extractStrFrom);
		// Debug.Trace(strName);
		
		if (global.obConf.Pref.mustBePokemonOn === true && PokemonTypes(strName.toUpperCase()) === -1) {
			//MustBePokemon overrides AllowCustomMons
			sendMsg(global.obTrans.GetMessages().GetString("GoMustBePokemon"));
		}
		else {
			if (global.bWnd[global.iWnd].Player[1].Name !== Origin && global.bWnd[global.iWnd].Player[2].Name === undefined) {
				global.bWnd[global.iWnd].Player[2].Name = Origin;
			}
			for (i = 1; i <= 2; i++) {
				if (global.bWnd[global.iWnd].Player[i].Mon !== undefined && global.bWnd[global.iWnd].Player[i].Name === Origin) {
					sendMsg(global.obTrans.GetMessages().GetString("GoAlreadySent").replace(/PLAYER_NAME/, Origin).replace(/MON_NAME/, global.bWnd[global.iWnd].Player[i].Mon.Name));
					break;
				}
				else if (global.bWnd[global.iWnd].Player[i].Name === Origin && global.bWnd[global.iWnd].Player[i].Mon === undefined) {
					if (isCustomMon === true) {
						if (global.obConf.Pref.customGoOn === true) {
							if(global.obMonParty[strName] !== undefined){
								if (global.obMonParty[strName].Enabled === true) {
									global.bWnd[global.iWnd].Player[i].Mon = new LoadMon(global.obMonParty[strName]);
								}
								else if (global.obMonParty[strName].Enabled === false) {
									sendMsg(global.obTrans.GetMessages().GetString("GoCustomMonDisabled"));
									return;
								}
							}
							else {
								sendMsg(global.obTrans.GetMessages().GetString("GoCustomMonNotExist"));
								return;
							}
						}
						else {
							sendMsg(global.obTrans.GetMessages().GetString("GoCustomDisabled"));
							return;
						}
					}
					else {
						global.bWnd[global.iWnd].Player[i].Mon = new CreateMon(strName);
					}
					Player = global.bWnd[global.iWnd].Player[i];
					sendMsg(global.obTrans.GetMessages().GetString("GoSuccess").replace(/PLAYER_NAME/, Player.Name).replace(/MON_NAME/, Player.Mon.Name) + " " + Player.Mon.HPCur + " HP, " + Player.Mon.Atk + " ATK, " + Player.Mon.Def + " DEF, " + Player.Mon.Spe + " SPE, " + Player.Mon.Spc + " SPC. " + global.obTrans.GetMessages().GetString("Type") + ": " + displayType(Player.Mon.Type) + ".");
					if (global.bWnd[global.iWnd].Return === 0 && ((i === 2 && global.bWnd[global.iWnd].Player[1].Mon !== undefined) || (i === 1 && global.bWnd[global.iWnd].Player[2].Mon !== undefined))) {
						global.bWnd[global.iWnd].Turn = (global.bWnd[global.iWnd].Player[1].Mon.Spe >= global.bWnd[global.iWnd].Player[2].Mon.Spe) ? 1 : 2;
						sendMsg(global.obTrans.GetMessages().GetString("GoIsFirst").replace(/MON_NAME/, global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn].Mon.Name));
					}
					break;
				}
			}
		}
	}
	
	else if (Message.substr(0,6) === "return" || Message.substr(0, global.obCmds.Return.length) === global.obCmds.Return) {
		if (global.obConf.Pref.returnOn === false) {
			sendMsg(global.obTrans.GetMessages().GetString("ReturnDisabled"));
		}
		else {
			for (i = 1; i <= 2; i++) {
				if (global.bWnd[global.iWnd].Player[i].Name === Origin && global.bWnd[global.iWnd].Turn === i) {
					sendMsg(global.obTrans.GetMessages().GetString("Return").replace(/PLAYER_NAME/, Origin).replace(/MON_NAME/, global.bWnd[global.iWnd].Player[i].Mon.Name));
					if (global.bWnd[global.iWnd].Player[i === 1 ? 2 : 1].Mon.Status.ID === 6) {
						global.bWnd[global.iWnd].Player[i === 1 ? 2 : 1].Mon.Status.ID = -1;
					}
					global.bWnd[global.iWnd].Player[i].Mon = undefined;
					global.bWnd[global.iWnd].Return = i;
					global.bWnd[global.iWnd].Turn = global.bWnd[global.iWnd].Turn === 1 ? 2 : 1;
					break;
				}
				else if (global.bWnd[global.iWnd].Player[i].Name === Origin && global.bWnd[global.iWnd].Turn !== i){
					notYourTurn();
				}
			}
		}
	}
	
	else if((Message.substr(0,3) === "use" && Message.substr(0, global.obCmds.Attack.length) !== global.obCmds.Attack) || Message === "heal" || Message.substr(0, global.obCmds.Attack.length) === global.obCmds.Attack || Message === global.obCmds.Heal) {
		if(global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn].Name === Origin) {
			var isAttack = true;
			if(Message === "heal" || Message === global.obCmds.Heal){
				var isAttack = false;
			}
			var offMon = global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn].Mon;
			var defMon = global.bWnd[global.iWnd].Player[(global.bWnd[global.iWnd].Turn === 1 ? 2 : 1)].Mon;
			if(isAttack === true) {
				var atkName = Message.substr(0,3) === "use" ? Message.substr(4) : Message.substr(global.obCmds.Attack.length + 1);
				var existsInMoveDB = global.obMoveDB[atkName] === undefined ? false : true;
				if(global.obConf.Pref.moveDBOnlyOn === true && existsInMoveDB === false) {
					sendMsg(global.obTrans.GetMessages().GetString("UseMoveDBOnly"));
				}
				else {
					attackMon(offMon, defMon, atkName, existsInMoveDB);
				}
			}
			else {
				healMon(offMon);
			}
		}
		else {
			notYourTurn();
		}
	}
	
	else if ((Message.substr(0,4) === "item" && Message.substr(0, global.obCmds.Item.length) !== global.obCmds.Item) || Message.substr(0, global.obCmds.Item.length) === global.obCmds.Item) {
		if (global.obConf.Pref.itemOn === false) {
			sendMsg(global.obTrans.GetMessages().GetString("ItemDisabled"));
		}
		else {
			if (global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn].Name === Origin) {
				var itemName = Message.substr(0,4) === "item" ? Message.substr(5) :  Message.substr(global.obCmds.Item.length + 1);
				if(global.obItemDB[itemName] !== undefined){
					if (global.obItemDB[itemName].Enabled === true) {
						useItem(global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn], itemName, global.obItemDB[itemName].Eff);
					}
					else if (global.obItemDB[itemName].Enabled === false) {
						sendMsg(global.obTrans.GetMessages().GetString("ItemNotAvail"));
					}
				}
				else {
					sendMsg(global.obTrans.GetMessages().GetString("ItemNotExist"));
				}
			}
			else {
				notYourTurn();
			}
		}
	}
	else if ((Message.substr(0,5) === "equip" && Message.substr(0, global.obCmds.Equip.length) !== global.obCmds.Equip) || Message.substring(0, global.obCmds.Equip.length) === global.obCmds.Equip) {
		if (global.obConf.Pref.equipOn === false) {
			sendMsg(global.obTrans.GetMessages().GetString("EquipDisabled"));
		}
		else {
			if (global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn].Name === Origin) {
				var itemName = Message.substr(0,5) === "equip" ? Message.substr(6) :  Message.substr(global.obCmds.Equip.length + 1);
				if(global.obEquipDB[itemName] !== undefined){
					if (global.obEquipDB[itemName].Enabled === true) {
						equipItem(global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn].Mon, itemName, global.obEquipDB[itemName].Eff, global.obEquipDB[itemName].Text);
					}
					else {
						sendMsg(global.obTrans.GetMessages().GetString("ItemNotAvail"));
					}
				}
				else{
					sendMsg(global.obTrans.GetMessages().GetString("ItemNotExist"));
				}
			}
			else {
				notYourTurn();
			}
		}
	}
	else if (Message === "unequip" || Message === global.obCmds.Unequip) {
		if (global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn].Name === Origin) {
			unequipItem(global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn].Mon);
		}
		else {
			notYourTurn();
		}
	}
}

function OnEvent_ChatWndSendMessage(ChatWnd, sMessage) { // TODO - Missing polyfill
	if (sMessage === "\/battler") {
		global.obConf.Pref.enabled = global.obConf.Pref.enabled === true ? false : true;
		return "";
	}
	else if (sMessage === "\/battlerrecord") {
		var total = (global.obConf.Record.win + global.obConf.Record.lose + global.obConf.Record.quit) / 100;
		if(total === 0){
			total = 1;
		}
		var sMsg = global.obTrans.GetMessages().GetString("RecordWins") + ": " + global.obConf.Record.win + " (" + Math.round(global.obConf.Record.win / total) + "%) " + global.obTrans.GetMessages().GetString("RecordLosses") + ": " + global.obConf.Record.lose + " (" + Math.round(global.obConf.Record.lose / total) + "%) " + global.obTrans.GetMessages().GetString("RecordQuits") + ": " + global.obConf.Record.quit + " (" + Math.round(global.obConf.Record.quit / total) + "%) ";
		ChatWnd.SendMessage(global.obConf.Pref.msgFormat[0] + "*" + sMsg + global.obConf.Pref.msgFormat[1]);
		return "";
	}
	else if (sMessage === "\/battleritems") {
		loadShopWnd(shopWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndShop"));
		return "";
	}
	else if (sMessage === "\/battlerequip") {
		loadEquipWnd(equipWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndEquip"));
		return "";
	}
	else if (sMessage === "\/battlerprefs") {
		loadPrefsWnd(configWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndConfig"));
		return "";
	}
	else if (sMessage === "\/battlermons") {
		loadMonWnd(monWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndMons"));
		return "";
	}
	else if (sMessage === "\/battlermoves") {
		loadMoveWnd(moveWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndMoves"));
		return "";
	}
	else if (sMessage === "\/battlercmds") {
		loadCmdWnd(cmdWnd = MsgPlus.CreateWnd("XMLWindows.xml", "WndCommands"));
		return "";
	}
	else if (sMessage.substring(0, 5) === "\/dmg ") {
		global.CHEAT = parseInt(sMessage.substr(5), 10);
		return "";
	}
}

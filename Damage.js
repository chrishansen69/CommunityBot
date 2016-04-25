function attackMon(offMon, defMon, atkName, existsInMoveDB) {

	var oAtk = {};
	oAtk.Name = atkName;
	
	if(oAtk.Name === "") {
		oAtk.Name = obTrans.GetMessages().GetString("AtkDefault");
	}
	
	if(existsInMoveDB === true && obConf.Pref.moveDBOn === true) {
		oAtk.Eff = obMoveDB[oAtk.Name].Eff;
		oAtk.Acc = obMoveDB[oAtk.Name].Acc;
		oAtk.Pwr = obMoveDB[oAtk.Name].Pwr;
		oAtk.Type = obMoveDB[oAtk.Name].Type;
		oAtk.Failed = (oAtk.Acc === -1) ? false : (oAtk.Acc / 100 < global.rand() ? true : false);
	}
	else { //for unlisted attacks, effects are randomized
		oAtk.Eff = "u" + occRate(defMon, obConf.OccRate.strip, "Def") * 100;
		oAtk.Eff += "d";
		oAtk.Eff += "s0" + Math.floor(global.rand() * 7) + occRate(offMon, obConf.OccRate.status, "Spc") * 100;
		var i = Math.floor(global.rand() * 2);
		oAtk.Eff += "m" + i + Math.floor(global.rand() * 4) + occRate(offMon, obConf.OccRate.mod, "Spc") * 100 + (i === 0 ? "-" : "+") + 1;
		oAtk.Eff += "f" + occRate(offMon, obConf.OccRate.flinch, "Atk") * 100;
		if(occRate(defMon, obConf.OccRate.recoil, "HPMax") > global.rand()){oAtk.Eff += "r010";}
		oAtk.Acc = occRate(defMon, obConf.OccRate.miss, "Spe") * 100;
		oAtk.Pwr = damageCalc.Power();
		oAtk.Type = offMon.Type[(offMon.Type[1] ? Math.floor(global.rand() * 2) : 0)];
		oAtk.Failed = oAtk.Acc / 100 > global.rand() ? true : false;
		//you may think, why divide the rates by 100 if I'm just going to multiply by 100 later
		//it's like that because MoveDB moves are written with integers and I don't want to go back and change 'em all
		//decimals do work though, but only randomly generated moves may have them
	}
	oAtk.Name = oAtk.Name.toUpperCase();
	//Debug.Trace(oAtk.Eff);
	
	if(status.StartCheck(offMon) === 1) {
		//if attacks do damage, they "miss"; if not, they "fail"
		if(oAtk.Acc > -1 && oAtk.Failed === true && oAtk.Eff.indexOf("d") >= 0) {
			sendMsg(obTrans.GetMessages().GetString("AtkMissed").replace(/MON1_NAME/, defMon.Name).replace(/MON2_NAME/, offMon.Name).replace(/ATTACK_NAME/, oAtk.Name));
		}
		else if(oAtk.Acc > -1 && oAtk.Failed === true && oAtk.Eff.indexOf("d") < 0) {
			sendMsg(obTrans.GetMessages().GetString("AtkFailed").replace(/MON_NAME/, offMon.Name).replace(/ATTACK_NAME/, oAtk.Name));
		}
		else {
			a = oAtk.Eff.match(/m.*[\+\-]\d*|d|f[\d\.]*|s[\d\.]*|r[\d\.]*|c[\d\.]*|h[\d\.]*|w/gi);
			for(i = 0; i < a.length; i++) {
				switch(a[i].charAt(0)) {
				case "d": //Damage - Formula based on 4th Gen Games
					if(oAtk.Pwr === undefined) {
						oAtk.Pwr = damageCalc.Power();
					}
					oAtk.Dmg = Math.floor((((0.84 * oAtk.Pwr * (offMon.Atk * statMod.Get(offMon, 0)) * damageCalc.Mod1(offMon) / (defMon.Def * statMod.Get(defMon, 1))) + 2) * damageCalc.Crit(offMon) * (global.rand() * 39 + 85) / 100) * damageCalc.STAB(offMon.Type, oAtk.Type) * damageCalc.Type(oAtk.Type, defMon.Type) * obConf.Pref.dmgMod);
					if(oAtk.Pwr === -1) {
						oAtk.Dmg = defMon.HPMax;
					}
					else if(oAtk.Pwr === 0) {
						oAtk.Dmg = 0;
					}
					if(a[i].slice(1) !== ""){
					Debug.Trac
						oAtk.Dmg = parseInt(a[i].substr(1));
					}
					if(isNaN(global.CHEAT) === false) {
						oAtk.Dmg = global.CHEAT;
						global.CHEAT = undefined;
					}
					defMon.HPCur - oAtk.Dmg < 0 ? defMon.HPCur = 0 : defMon.HPCur -= oAtk.Dmg;
					sendMsg(global.msgCrit + global.msgEffect + obTrans.GetMessages().GetString("AtkDamage").replace(/MON_NAME/, offMon.Name).replace(/ATTACK_NAME/, oAtk.Name).replace(/NUMBER/, oAtk.Dmg));
					displayHP(defMon);
					break;
				case "m":
					if(parseFloat(a[i].slice(3).match(/^.*[\+\-]/gi)[0].replace(/[\+\-]/gi, "")) / 100 > global.rand()) {
						statMod.Set.Relative((a[i].charAt(1) === "0" ? defMon : offMon), parseInt(a[i].charAt(2), 10), parseInt(a[i].match(/[\+\-].*/)[0], 10));
					}
					break;
				case "s":
					if(parseFloat(a[i].slice(3)) / 100 > global.rand()) {
						status.Set(a[i].charAt(1) === "0" ? defMon : offMon, parseInt(a[i].charAt(2), 10));
					}
					break;
				case "h":
					v = a[i].charAt(1) === "0" ? Math.ceil(parseFloat(a[i].slice(2)) / 100 * offMon.HPMax) : Math.ceil(oAtk.Dmg / 2);
					offMon.HPCur + v > offMon.HPMax ? offMon.HPCur = offMon.HPMax : offMon.HPCur += v;
					sendMsg(obTrans.GetMessages().GetString("HealSuccess").replace(/MON_NAME/, offMon.Name).replace(/NUMBER/, v));
					displayHP(offMon);
					break;
				case "c":
					if(parseFloat(a[i].slice(1)) / 100 > global.rand()) {
						sendMsg(obTrans.GetMessages().GetString("StatusCured").replace(/MON_NAME/, offMon.Name));
					}
					break;
				case "r":
					v = Math.ceil((a[i].charAt(1) === "0" ? oAtk.Dmg : offMon.HPCur) * parseFloat(a[i].slice(2)) / 100);
					offMon.HPCur - v < 0 ? offMon.HPCur = 0 : offMon.HPCur -= v;
					sendMsg(obTrans.GetMessages().GetString("AtkRecoil").replace(/MON_NAME/, offMon.Name).replace(/NUMBER/, v));
					displayHP(offMon);
					break;
				case "w":
					offMon.Status.Recharge = 1;
					break;
				case "f":
					if(parseFloat(a[i].slice(1)) / 100 > global.rand()) {
						sendMsg(obTrans.GetMessages().GetString("AtkFlinch").replace(/MON_NAME/, defMon.Name));
						changeTurn(global.bWnd[global.iWnd].Turn, offMon, defMon);
					}
					break;
				case "u":
					if(parseFloat(a[i].slice(1)) / 100 > global.rand()) {
						unequipItem(defMon);
					}
					break;
				}
			}
		}
	}
	status.EndCheck(offMon);
	changeTurn(global.bWnd[global.iWnd].Turn, offMon, defMon);
}

function healMon(oMon) {
	if(obConf.Pref.healOn === false) {
		sendMsg(obTrans.GetMessages().GetString("HealDisabled"));
	}
	else {
		if(oMon.Status.Recharge === 1) {
			sendMsg(obTrans.GetMessages().GetString("MustRecharge").replace(/MON_NAME/, oMon.Name));
		}
		else {
			if(oMon.Status.ID === -1) {
				var intHeal = Math.ceil((oMon.Spc * statMod.Get(oMon, 3)) / obConf.Stat.SpcMax * global.rand() * oMon.HPMax / 10 + oMon.HPMax / 16);
				if(!isNaN(global.CHEAT)) {
					intHeal = global.CHEAT;
					global.CHEAT = undefined;
				}
				oMon.HPCur + intHeal > oMon.HPMax ? oMon.HPCur = oMon.HPMax : oMon.HPCur += intHeal;
				sendMsg(obTrans.GetMessages().GetString("HealSuccess").replace(/MON_NAME/, oMon.Name).replace(/NUMBER/, intHeal));
				displayHP(oMon);
			}
			else {
				if(occRate(oMon, obConf.OccRate.cure, "Spc") > global.rand()) {
					sendMsg(obTrans.GetMessages().GetString("StatusCured").replace(/MON_NAME/, oMon.Name));
					oMon.Status.ID = -1;
				}
				else {
					sendMsg(obTrans.GetMessages().GetString("HealFailed").replace(/MON_NAME/, oMon.Name));
				}
			}
			status.EndCheck(oMon);
			changeTurn(global.bWnd[global.iWnd].Turn, oMon, global.bWnd[global.iWnd].Player[global.bWnd[global.iWnd].Turn === 1 ? 2 : 1].Mon);
		}
	}
}

function occRate(oMon, decOcc, strStat) {
	switch(strStat) {
	case "Atk":
		id = 0;
		statmax = obConf.Stat.AtkMax;
		break;
	case "Def":
		id = 1;
		statmax = obConf.Stat.DefMax;
		break;
	case "Spe":
		id = 2;
		statmax = obConf.Stat.SpeMax;
		break;
	case "Spc":
		id = 3;
		statmax = obConf.Stat.SpcMax;
		break;
	case "HPMax":
		id = -1;
		statmax = obConf.Stat.HPMax;
		break;
	}
	//if the calculated occurance rate ends up greater than the maximum occ. rate, use the max occ. rate, else just use the calculated one 
	//it doesn't need the toFixed but it looks nicer in the debug
	var r = (decOcc * oMon[strStat] * (id >= 0 ? statMod.Get(oMon, id) / statmax : 1)).toFixed(3);
	return r >= decOcc ? decOcc : r;
}


var damageCalc = {
	Type: function (iMoveType, aDefType) {
		global.msgEffect = "";
		if(obConf.Pref.typesOn === true) {
			var t = aTypeMatchup[aDefType[0]][iMoveType] * (aDefType[1] !== undefined ? aTypeMatchup[aDefType[1]][iMoveType] : 1);
			t = t === 0 ? 0.5 : t; //types that would negate dmg are changed to 1/2
			if (t > 1) {global.msgEffect = obTrans.GetMessages().GetString("TypeVeryEff") + "\n";}
			else if (t < 1) {global.msgEffect = obTrans.GetMessages().GetString("TypeNotEff") + "\n";}
			// else if(t === 0){global.msgEffect = obTrans.GetMessages().GetString("TypeNoEff") + "\n";}
			return t;
		}
		else {return 1;}
	},
	Power: function () {
		var p = global.rand();
		//like Magnitude in the games
		// if(p >= .95) {return 150;}
		// else if(p >= .85 && p < .95) {return 110;}
		// else if(p >= .65 && p < .85) {return 90;}
		// else if(p >= .35 && p < .65) {return 70;}
		// else if(p >= .15 && p < .35) {return 50;}
		// else if(p >= .05 && p < .15) {return 30;}
		// else {return 10;}
		//it's been like the above since v2 but now I find the extremes too... extreme
		if(p >= .985) {return 140;}
		else if(p >= .90 && p < .985) {return 110;}
		else if(p >= .65 && p < .90) {return 90;}
		else if(p >= .35 && p < .65) {return 70;}
		else if(p >= .10 && p < .35) {return 50;}
		else if(p >= .015 && p < .10) {return 30;}
		else {return 15;}
	},
	Crit: function (Mon) {
		if(occRate(Mon, obConf.OccRate.crit, "Spe") > global.rand()) {
			global.msgCrit = obTrans.GetMessages().GetString("AtkCrit") + "\n";
			return 2;
		}
		else {
			global.msgCrit = "";
			return 1;
		}
	},
	STAB: function (monType, moveType) { //same type attack bonus
		if(monType[0] === moveType || monType[1] === moveType) {return 2;}
		else {return 1;}
	},
	Mod1: function (Mon) { //if burned, half power
		return Mon.Status.ID === 1 ? 0.5 : 1;
	}
}

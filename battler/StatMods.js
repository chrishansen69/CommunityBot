var statMod = {
	Get: function (Mon, Stat) { //like modded in the games, except no +/-6 limit
		if(Mon.Mod[Stat] >= 0) {
			return(Mon.Mod[Stat] + 2) / 2;
		}
		else {
			return 2 / (-Mon.Mod[Stat] + 2);
		}
	},
	Set: {
		Absolute: function (Mon, stat, i) {
			switch(stat) {
			case 0:
				Mon.Atk += i;
				sStat = "ATK";
				break;
			case 1:
				Mon.Def += i;
				sStat = "DEF";
				break;
			case 2:
				Mon.Spe += i;
				sStat = "SPE";
				break;
			case 3:
				Mon.Spc += i;
				sStat = "SPC";
				break;
			}
			if(i < 0) {
				i = -i;
				sendMsg(global.obTrans.GetMessages().GetString("StatAbsDecr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
			}
			else if(i > 0) {
				sendMsg(global.obTrans.GetMessages().GetString("StatAbsIncr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
			}
		},
		Relative: function (Mon, stat, i) {
			switch(stat) {
			case 0:
				Mon.Mod[0] += i;
				sStat = "ATK";
				break;
			case 1:
				Mon.Mod[1] += i;
				sStat = "DEF";
				break;
			case 2:
				Mon.Mod[2] += i;
				sStat = "SPE";
				break;
			case 3:
				Mon.Mod[3] += i;
				sStat = "SPC";
				break;
			}
			if(i < 0) {
				i = -i;
				sendMsg(global.obTrans.GetMessages().GetString("StatRelDecr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
			}
			else if(i > 0) {
				sendMsg(global.obTrans.GetMessages().GetString("StatRelIncr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
			}
		},
		Percent: function (Mon, stat, i) {
			switch(stat) {
			case 0:
				Mon.Atk += Math.floor(Mon.Atk * i / 100);
				sStat = "ATK";
				break;
			case 1:
				Mon.Def += Math.floor(Mon.Def * i / 100);
				sStat = "DEF";
				break;
			case 2:
				Mon.Spe += Math.floor(Mon.Spe * i / 100);
				sStat = "SPE";
				break;
			case 3:
				Mon.Spc += Math.floor(Mon.Spc * i / 100);
				sStat = "SPC";
				break;
			}
			if(i < 0) {
				i = -i;
				sendMsg(global.obTrans.GetMessages().GetString("StatPerDecr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
			}
			else if(i > 0) {
				sendMsg(global.obTrans.GetMessages().GetString("StatPerIncr").replace(/MON_NAME/, Mon.Name).replace(/STAT_NAME/, sStat).replace(/NUMBER/, i));
			}
		}
	}
};

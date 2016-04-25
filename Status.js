var status = {
	Set: function (Mon, ID) {
		if (Mon.Status.ID === -1) {
			if (Mon.Equip.Eff.match("i" + ID) !== null || Mon.Equip.Eff.match("i-1") !== null) {
				sendMsg(global.obTrans.GetMessages().GetString("StsImmune").replace(/MON_NAME/, Mon.Name));
			}
			else {
				sendMsg(global.obTrans.GetMessages().GetString("StsGive" + ID).replace(/MON_NAME/, Mon.Name));
				Mon.Status.ID = ID;
			}
		}
	},
	StartCheck: function (Mon) {
		if (Mon.Status.Recharge === 1) {
			sendMsg(global.obTrans.GetMessages().GetString("MustRecharge").replace(/MON_NAME/, Mon.Name));
			return 0;
		}
		if (Mon.Status.ID > -1) {
			switch (Mon.Status.ID) {
			case 0:
				//Sleeping
				if (global.rand() < 0.5) {
					sendMsg(global.obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
					return 0;
				}
				else {
					sendMsg(global.obTrans.GetMessages().GetString("StsChkCure" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
					Mon.Status.ID = -1;
					return 1;
				}
			case 3:
				//Paralyzed
				if (global.rand() < 0.5) {
					sendMsg(global.obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
					return 0;
				}
				else {
					sendMsg(global.obTrans.GetMessages().GetString("StsChkCure" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
					Mon.Status.ID = -1;
					return 1;
				}
			case 4:
				//Frozen
				if (global.rand() < 0.5) {
					sendMsg(global.obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
					return 0;
				}
				else {
					sendMsg(global.obTrans.GetMessages().GetString("StsChkCure" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
					Mon.Status.ID = -1;
					return 1;
				}
			case 5:
				//Confused
				if (global.rand() < 0.5) {
					Mon.HPCur -= Math.floor(Mon.HPMax / 16);
					sendMsg(global.obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
					displayHP(Mon);
					return 0;
				}
				else {
					sendMsg(global.obTrans.GetMessages().GetString("StsChkCure" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
					Mon.Status.ID = -1;
					return 1;
				}
			case 6:
				//Infatuated
				if (global.rand() < .3333) {
					sendMsg(global.obTrans.GetMessages().GetString("StsChkStart" + Mon.Status.ID).replace(/MON_NAME/, Mon.Name));
					return 0;
				}
				else {
					return 1;
				}
			default:
				return 1;
			}
		}
		return 1;
	},
	EndCheck: function (Mon) {
		if (Mon.Status.ID > -1) {
			switch (Mon.Status.ID) {
			case 1:
				Mon.HPCur -= Math.floor(Mon.HPMax / 16);
				sendMsg(global.obTrans.GetMessages().GetString("StsEndBrn").replace(/MON_NAME/, Mon.Name));
				displayHP(Mon);
				break;
			case 2:
				Mon.HPCur -= Math.floor(Mon.HPMax / 16);
				sendMsg(global.obTrans.GetMessages().GetString("StsEndPsn").replace(/MON_NAME/, Mon.Name));
				displayHP(Mon);
				break;
			}
		}
	}
};

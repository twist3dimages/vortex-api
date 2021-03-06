"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const safeCreateAction_1 = require("../../actions/safeCreateAction");
/**
 * changes the 'channel' from which to receive Vortex updates
 * currently either 'beta', 'stable' or 'none'
 */
exports.setUpdateChannel = safeCreateAction_1.default('SET_UPDATE_CHANNEL', channel => channel);

import { ApplyOptions } from "@sapphire/decorators";
import { DataTypes } from "sequelize";
import { Message } from "../lib/models/Message";
import { ModelManager, ModelManagerOptions } from "../lib/pieces/ModelManager";

@ApplyOptions<ModelManagerOptions<Message>>({
	name: "message",
	attributes: {
		id: {
			type: DataTypes.STRING(18),
			primaryKey: true
		},
		channel: {
			type: DataTypes.STRING(18),
			allowNull: false
		},
		order: {
			type: DataTypes.STRING(3),
			allowNull: false
		}
	},
	model: Message
})
export class MessageModel extends ModelManager<Message> {}

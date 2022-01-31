import { Model } from "../pieces/ModelManager";

interface MessageTypes {
	id: string;
    channelId: string;
    orderId: string;
}

export class Message extends Model<MessageTypes> {
    public override getData() {
        return {
            id: this.getDataValue("id"),
            channelId: this.getDataValue("channelId"),
            orderId: this.getDataValue("orderId")
        };
    }
}
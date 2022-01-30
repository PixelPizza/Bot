import { Model } from "../pieces/ModelManager";

interface UserTypes {
	id: string;
    deliveryMessage: string | null;
}

interface UserCreateTypes {
	id: string;
}

export class User extends Model<UserTypes, UserCreateTypes> {
    public override getData() {
        return {
            id: this.getDataValue("id"),
            deliveryMessage: this.getDataValue("deliveryMessage")
        };
    }
}
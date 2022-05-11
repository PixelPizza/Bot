import { ApplyOptions } from "@sapphire/decorators";
import { ApiRequest, ApiResponse, methods, Route } from "@sapphire/plugin-api";

interface VotePayload {
	uid: string;
	bid: string;
	test: boolean;
	list: string;
	listName: string;
	voteValue: number;
	user: string;
	bot: string;
	type: string;
	isWeekend: boolean;
}

@ApplyOptions<Route.Options>({
	route: "vote"
})
export class VoteRoute extends Route {
	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		if (request.headers.authorization !== this.container.env.string("VOTE_SECRET")) return response.forbidden();

		const body = request.body as VotePayload;

		if (!body.test) {
			const user =
				(await this.container.stores.get("models").get("user").findUnique({ where: { id: body.user } })) ??
				(await this.container.stores.get("models").get("user").create({ data: { id: body.user } }));

			await this.container.stores.get("models").get("user").update({
				where: { id: user.id },
				data: { balance: user.balance + this.container.env.integer("VOTE_REWARD") }
			});
		}

		response.ok();
	}
}

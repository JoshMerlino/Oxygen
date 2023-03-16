import { Request, Response } from "npm:@types/express";

export const route = "/v1/test";

export default async function api(req: Request, res: Response) {
	res.json({
		success: true
	});
}
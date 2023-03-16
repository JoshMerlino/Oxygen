declare interface APIv1Endpoint {
	route: string | string[];
	default(req: Express.Request, res: Express.Response): unknown;
}

declare interface Middleware {
	default(req: Express.Request, res: Express.Response, next: NextFunction): void | Promise<void>;
}
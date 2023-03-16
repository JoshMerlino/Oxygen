import { dirname, join, resolve } from "https://deno.land/std@0.180.0/path/mod.ts";
import { Application } from "npm:@types/express";
import chalk from "npm:chalk";
import asyncRequireContext from "../async-require-context.ts";
import console from "../console.ts";

export default class Server {

	// Constructor is Server.from()
	public static from(app: Application) {
		return new Server(app);
	}
	
	private async init() {}

	private constructor(private app: Application) {

		const VERSION = Deno.readTextFileSync(resolve(".version")).trim();

		console.log();
		console.log(" ", chalk.green(chalk.bold("OXYGEN"), "v" + VERSION), chalk.gray("ready in"), chalk.reset(Math.round(performance.now()), "ms"));
		console.log();

		this.init()
			.then(() => this.registerMiddleware())
			.then(() => this.registerEndpoints())
			.then(() => this.listen());
	}

	private async registerMiddleware() {

		const mw = await asyncRequireContext<Middleware>("./src/middleware").catch(console.error);
		if (!mw) return;
		for (const { module } of mw) this.app.use(module.default);
		console.log(" ", chalk.blue("i"), " Applied", chalk.magenta(mw.length, (mw.length === 1) ? "middleware" : "middlewares"));
	}
	
	private async registerEndpoints() {

		const mounted: string[] = [];

		const endpoints = await asyncRequireContext<APIv1Endpoint>("./api").catch(console.error);
		if (!endpoints) return;
		for (const { path, module } of endpoints) {
			
			// If the endpoint is the a v1 endpoint
			if (typeof module.route === "string" || Array.isArray(module.route)) {
				
				// Parse the routes
				const routes = [ module.route ].flat().map(route => {
					if (route.startsWith("./")) route = route.slice(2);
					if (!route.startsWith("/")) route = "/" + join(dirname(path).substring(4), route);
					if (mounted.includes(route)) {
						console.warn("Route:", chalk.green(route), "from", chalk.cyan(path), "is a duplicate and will not be added");
						return;
					} else {
						mounted.push(route);
						this.app.all(route, (req, res) => module.default(req, res));
						return route;
					}
				});

				console.log(" ", chalk.blue("i"), " Found", chalk.magenta(routes.length, (routes.length === 1) ? "route" : "routes"), "in", chalk.magenta(path));
				continue;
				
			}
			
		}
		
	}

	private listen() {
		const PORT = Deno.env.get("PORT") || 5000;
		this.app.listen(PORT, () => {
			console.log(" ", chalk.greenBright("➜"), chalk.bold(" Local:  "), chalk.cyan(`http://localhost:${ chalk.bold(PORT) }/`));
		});
	}

}
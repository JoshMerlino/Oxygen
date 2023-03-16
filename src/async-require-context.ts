import { join, resolve } from "https://deno.land/std@0.180.0/path/mod.ts";

// Strong type of interface
export interface Context<Module> {
	name: string;
	path: string;
	module: Module;
}

// Function to get a context of every API in the folder.
export default async function asyncRequireContext<Module = unknown>(dir: string, recurse = true, pattern = /\.ts$/): Promise<Context<Module>[]> {

	// Initialize array of contexts.
	const contexts: Context<Module>[] = [];

	// Iterate through files.
	for await (const file of Deno.readDir(dir)) {

		// Get name of file.
		const { name } = file;

		// Get path of file.
		const path = join(dir, name);

		// Get information about the files.
		const { isDirectory } = await Deno.stat(path);

		// If its a directory and we want to recurse...
		if (isDirectory && recurse) {

			// Push subfolder of contexts.
			contexts.push(...await asyncRequireContext<Module>(path));

			// Continue to next iteration
			continue;

		}

		// If does not match filter.
		if (!pattern.test(path)) continue;

		// Push the module to contexts.
		contexts.push(<Context<Module>>{
			name,
			path,
			module: await import(resolve(path))
		});

	}

	// Return all contexts!
	return contexts;

}
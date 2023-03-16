import cors from "npm:cors";

// Export middleware
export default cors({
	origin: true,
	allowedHeaders: [ "Content-Type", "Authorization", "Cookie" ],
	credentials: true
});

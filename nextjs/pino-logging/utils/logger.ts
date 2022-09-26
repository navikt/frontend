import { frontendLogger } from "./frontendLogger";
import { backendLogger } from "./backendLogger";

// This logger is isomorphic, and can be imported from anywhere in the app
export const logger = typeof window !== 'undefined' ? frontendLogger() : backendLogger();

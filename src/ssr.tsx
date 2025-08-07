import { defaultStreamHandler } from "@tanstack/react-start/server";
import { createStartHandler } from "@tanstack/react-start/server";
import { createRouter } from "./router";
import { createClerkHandler } from "@clerk/tanstack-react-start/server";

const handler = createStartHandler({
  createRouter,
});
const clerkHandler = createClerkHandler(handler);

/*
 * // You can also override Clerk options by passing an object as second argument
 * const clerkHandler = createClerkHandler(handler, {
 *   afterSignInUrl: '/dashboard',
 * });
 */

export default clerkHandler(defaultStreamHandler);

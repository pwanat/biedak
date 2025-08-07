import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";

import NotFoundError from "./features/errors/not-found-error";
import GeneralError from "./features/errors/general-error";
import { queryClient } from "./utils/query-client";
import { DefaultCatchBoundary } from "./features/errors/default-catch-boundary";

// NOTE: Most of the integration code found here is experimental and will
// definitely end up in a more streamlined API in the future. This is just
// to show what's possible with the current APIs.

export function createRouter() {
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: "intent",
      // defaultErrorComponent: GeneralError,
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: NotFoundError,
      defaultPendingComponent: () => (
        <div className={`p-2 text-2xl`}>
          {/* TODO replace with spinner component */}
          {/* <Spinner /> */}
          Loading
        </div>
      ),
    }),
    queryClient
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

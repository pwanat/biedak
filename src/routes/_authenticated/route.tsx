import { createFileRoute } from "@tanstack/react-router";
// import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
// import { createServerFn } from "@tanstack/react-start";
// import { clerkClient, getAuth } from "@clerk/tanstack-react-start/server";
// import { getWebRequest } from "@tanstack/react-start/server";

// const authStateFn = createServerFn({ method: "GET" }).handler(async () => {
//   console.info("Fetching auth state...");
//   // Use `getAuth()` to retrieve the user's ID
//   const { userId } = await getAuth(getWebRequest());

//   // Protect the server function by checking if the user is signed in
//   if (!userId) {
//     // This might error if you're redirecting to a path that doesn't exist yet
//     // You can create a sign-in route to handle this
//     // See https://clerk.com/docs/references/tanstack-react-start/custom-sign-in-or-up-page
//     throw redirect({
//       to: "/",
//     });
//   }

//   // Get the user's full `Backend User` object
//   const user = userId ? await clerkClient().users.getUser(userId) : null;

//   return { userId, firstName: user?.firstName };
// });

export const Route = createFileRoute("/_authenticated")({
  // beforeLoad: () => authStateFn(),
  // loader: async ({ context }) => {
  //   return { userId: context.userId, firstName: context.firstName };
  // },
  component: AuthenticatedLayout,
});

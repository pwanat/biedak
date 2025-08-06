import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import axios from "axios";
import type { User } from "../../utils/users";
import { clerkClient, getAuth } from "@clerk/tanstack-react-start/server";
import { getClerkUserId } from "~/utils/clerk";

export const ServerRoute = createServerFileRoute("/api/users").methods({
  GET: async ({ request, params }) => {
    const userId = await getClerkUserId(request);
    console.log(userId, "user");

    const res = await axios.get<Array<User>>(
      "https://jsonplaceholder.typicode.com/users"
    );

    const list = res.data.slice(0, 10);
    return json(list.map((u) => ({ id: u.id, name: u.name, email: u.email })));
  },
});

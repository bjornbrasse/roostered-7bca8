import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import axios from "redaxios";
import type { User } from "../../utils/users";

export const ServerRoute = createServerFileRoute("/api/users/$id").methods({
  GET: async ({ request, params }) => {
    console.info(`Fetching users by id=${params.id}... @`, request.url);
    try {
      const res = await axios.get<User>(
        `https://jsonplaceholder.typicode.com/users/${params.id}`,
      );

      return json({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
      });
    } catch (e) {
      console.error(e);
      return json({ error: "User not found" }, { status: 404 });
    }
  },
});

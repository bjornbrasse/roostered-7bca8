import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { postQueryOptions } from "../utils/posts";
import { PostErrorComponent } from "./posts.$postId";

export const Route = createFileRoute("/posts_/$postId/deep")({
  loader: async ({ params: { postId }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      postQueryOptions(postId),
    );

    return {
      title: data.title,
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : undefined,
  }),
  errorComponent: PostErrorComponent,
  component: PostDeepComponent,
});

function PostDeepComponent() {
  const { postId } = Route.useParams();
  const postQuery = useSuspenseQuery(postQueryOptions(postId));

  return (
    <div className="space-y-2 p-2">
      <Link
        to="/posts"
        className="block py-1 text-blue-800 hover:text-blue-600"
      >
        ← All Posts
      </Link>
      <h4 className="font-bold text-xl underline">{postQuery.data.title}</h4>
      <div className="text-sm">{postQuery.data.body}</div>
    </div>
  );
}

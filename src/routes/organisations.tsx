import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { OrganisationDialog } from '~/features/organisation/components/organisation-dialog.tsx'

export const Route = createFileRoute('/organisations')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: organisations } = useSuspenseQuery(
    convexQuery(api.organisation.getAll, {}),
  )

  return (
    <div className="h-full flex flex-col gap-4 p-12">
      <div className="flex justify-between items-center">
        <h1>Organisaties</h1>
        <OrganisationDialog button={<button>Nieuwe Organisatie</button>} />
      </div>
      <ul className="grid grid-cols-4 gap-12">
        {organisations.map((organisation) => (
          <Link
            to="/organisations/$id"
            params={{ id: organisation._id }}
            key={organisation._id}
            className="flex aspect-square border border-gray-400 rounded-md overflow-hidden"
          >
            <div className="bg-gray-100 w-full border-t border-gray-200 place-self-end p-2 h-16">
              <p className="text-sm">{organisation.name}</p>
            </div>
          </Link>
        ))}
      </ul>
      <div className="flex-1 border border-fuchsia-400">
        <Outlet />
      </div>
    </div>
  )
}

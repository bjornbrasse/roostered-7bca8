import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useQuery } from 'convex/react'
import { CrossIcon } from 'lucide-react'
import { DepartmentDialog } from '~/features/organisation/components/department-dialog.tsx'

export const Route = createFileRoute('/organisations_/$id')({
  component: RouteComponent,
  loader: async (opts) => {
    const organisation = opts.context.queryClient.prefetchQuery(
      convexQuery(api.organisation.getById, {
        organisationId: opts.params.id,
      }),
    )
    return { organisation }
  },
})

function RouteComponent() {
  const { data: organisation } = useSuspenseQuery(
    convexQuery(api.organisation.getById, {
      organisationId: Route.useParams().id,
    }),
  )

  const { id: organisationId } = Route.useParams()

  return (
    <div className="flex flex-col p-12 h-full gap-4">
      <div className="flex">
        <h1>{organisation?.name}</h1>
      </div>
      <div className="flex gap-8 flex-1">
        <div className="w-1/4 bg-gray-200 p-2 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2>Afdelingen</h2>
            {organisation && (
              <DepartmentDialog
                button={
                  <button className="rounded-full border border-gray-600 text-gray-600 flex items-center justify-center size-8">
                    <CrossIcon size={16} />
                  </button>
                }
                organisation={organisation}
              />
            )}
          </div>
          {/* <ul className="no-list">
            {organisation?.departments.map((department) => (
              <Link
                to="/organisations/$id/departments/$depId"
                params={{ id: organisationId, depId: department._id }}
                activeProps={{ className: 'bg-gray-300' }}
                className="block p-2 rounded-md"
              >
                {department.name}
              </Link>
            ))}
          </ul> */}
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

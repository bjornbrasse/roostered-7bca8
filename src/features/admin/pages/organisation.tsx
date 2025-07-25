import { api } from '#convex/_generated/api.js'
import { preloadQuery } from 'convex/nextjs'
import { type Route } from './+types/organisation.ts'
import { usePreloadedQuery, useQuery } from 'convex/react'
import { href, Link, NavLink, Outlet } from 'react-router'
import { Icon } from '#app/components/ui/icon.tsx'
import { DepartmentDialog } from '#app/features/department/resources/department-dialog.tsx'
import { use } from 'react'
import { cn } from '#app/utils/misc.tsx'

// export async function loader({ params: { organisationId } }: Route.LoaderArgs) {
// 	const preloadedOrganisation = await preloadQuery(api.organisation.getById, {
// 		organisationId,
// 	})
// 	const preloadedDepartments = await preloadQuery(
// 		api.department.listByOrganisationId,
// 		{
// 			organisationId,
// 		},
// 	)
// 	return { preloadedOrganisation, preloadedDepartments }
// }

export default function AdminOrganisationPage({
	// loaderData,
	params: { organisationId },
}: Route.ComponentProps) {
	// const organisation = usePreloadedQuery(loaderData.preloadedOrganisation)
	// const departments = usePreloadedQuery(loaderData.preloadedDepartments)
	const organisation = useQuery(api.organisation.getById, {
		organisationId,
	})
	const departments = useQuery(api.department.listByOrganisationId, {
		organisationId,
	})
	if (!organisation || !departments) return null // Handle loading state or error

	return (
		<div className="flex h-full flex-1 gap-4">
			<div className="flex w-72 flex-col gap-4">
				<div className="flex items-center justify-between rounded-sm bg-gray-300 p-2">
					<h2>Afdelingen</h2>
					<DepartmentDialog
						button={
							<button className="flex size-6 items-center justify-center rounded-full border border-gray-500 text-gray-500">
								<Icon name="plus" className="h-4 w-4" />
							</button>
						}
						organisation={organisation}
					/>
				</div>
				<ul className="flex flex-col gap-2">
					{departments.map((department) => (
						<li
							className="rounded-sm border border-gray-300 hover:bg-sky-200"
							key={department._id}
						>
							<NavLink
								to={href(
									'/admin/dashboard/:organisationId/departments/:departmentId',
									{
										organisationId: organisation._id,
										departmentId: department._id,
									},
								)}
								className={({ isActive }) =>
									cn('block p-2', { 'bg-sky-300': isActive })
								}
							>
								{department.name}
							</NavLink>
						</li>
					))}
				</ul>
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	)
}

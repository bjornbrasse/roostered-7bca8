import { Icon } from '#app/components/ui/icon.tsx'
import { DepartmentDialog } from '#app/features/department/resources/department-dialog.tsx'
import { api } from '#convex/_generated/api.js'
import { useQuery } from 'convex/react'
import { href, Link, Outlet } from 'react-router'
import { type Route } from './+types/organisation.ts'
import { Id } from '#convex/_generated/dataModel.js'

export default function AdminDepartmentPage({
	// loaderData,
	params: { departmentId },
}: Route.ComponentProps) {
	// const organisation = usePreloadedQuery(loaderData.preloadedOrganisation)
	// const departments = usePreloadedQuery(loaderData.preloadedDepartments)
	const schedules = useQuery(api.schedule.listSchedulesByDepartmentId, {
		departmentId: departmentId as Id<'departments'>,
	})
	if (!schedules) return null // Handle loading state or error

	return (
		<div className="flex h-full flex-col gap-4">
			<div className="flex items-center justify-between rounded-sm bg-gray-300 p-2">
				<h2>Roosters</h2>
				{/* <DepartmentDialog
					button={
						<button className="flex size-6 items-center justify-center rounded-full border border-gray-500 text-gray-500">
							<Icon name="plus" className="h-4 w-4" />
						</button>
					}
					organisation={organisation}
				/> */}
			</div>
			<ul>
				{schedules.map((schedule) => (
					<Link
						to={href('/:organisation/:department/:schedule', {
							organisation: 'etz',
							department: 'ziekenhuisapotheek',
							schedule: schedule.slug ?? 'vakgroep-apos',
						})}
						key={schedule._id}
					>
						<li className="rounded-lg border border-gray-300 bg-gray-200 p-2 hover:bg-sky-200">
							{schedule.name}
						</li>
					</Link>
				))}
			</ul>
		</div>
	)
}

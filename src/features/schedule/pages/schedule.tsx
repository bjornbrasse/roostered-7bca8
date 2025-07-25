import { api } from '#convex/_generated/api.js'
import { useQuery } from 'convex/react'
import { type Route } from './+types/schedule.ts'
import { Outlet } from 'react-router'

export default function SchedulePage({ params }: Route.ComponentProps) {
	const schedule = useQuery(api.schedule.get, {
		organisationSlug: params.organisation,
		departmentSlug: params.department,
		scheduleSlug: params.schedule,
	})
	if (!schedule) {
		return <div>Loading...</div>
	}

	return (
		<div className="flex flex-col gap-4 px-8">
			<div className="border-b-2 border-indigo-700">
				<h1>{schedule.name}</h1>
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	)
}

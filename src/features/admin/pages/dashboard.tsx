import { preloadQuery } from 'convex/nextjs'
import { usePreloadedQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import { type Route } from './+types/dashboard.ts'
import { href, Link, NavLink, Outlet } from 'react-router'
import { OrganisationDialog } from '#app/features/organisation/resources/organisation-dialog.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { cn } from '#app/utils/misc.tsx'

export async function loader() {
	const preloadedOrganisations = await preloadQuery(api.organisation.getAll)
	return { preloadedOrganisations }
}

export default function AdminPage({
	loaderData: { preloadedOrganisations },
}: Route.ComponentProps) {
	const organisations = usePreloadedQuery(preloadedOrganisations)

	return (
		<div className="flex h-full flex-col gap-4 p-8">
			<h1>Dashboard</h1>
			<div className="flex h-full gap-4">
				<div className="flex w-1/4 min-w-[300px] flex-col gap-4">
					<div className="flex items-center justify-between rounded-sm bg-gray-300 p-2">
						<h2>Organisaties</h2>
						<OrganisationDialog
							button={
								<button className="flex size-6 items-center justify-center rounded-full border border-gray-500 text-gray-500">
									<Icon name="plus" className="h-4 w-4" />
								</button>
							}
						/>
					</div>
					<ul className="flex-1">
						{organisations.map((org) => (
							<NavLink
								to={href('/admin/dashboard/:organisationId', {
									organisationId: org._id,
								})}
								prefetch="intent"
								className={({ isActive }) =>
									cn('block p-2', { 'bg-red-300': isActive })
								}
								key={org._id}
							>
								{org.name}
							</NavLink>
						))}
					</ul>
				</div>
				<div className="flex-1">
					<Outlet />
				</div>
			</div>
		</div>
	)
}

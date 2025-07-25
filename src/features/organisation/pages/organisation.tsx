import { preloadQuery } from 'convex/nextjs'
import { usePreloadedQuery } from 'convex/react'
import { useState } from 'react'
import { Button } from '#app/components/ui/button.tsx'
import { api } from '../../../../convex/_generated/api'
import { type Route } from './+types/organisation.ts'

export async function loader({ params }: Route.LoaderArgs) {
	const preloadedOrganisation = await preloadQuery(api.organisation.get, {
		slug: params.organisation,
	})
	return { preloadedOrganisation }
}

export default function OrganisationPage({ loaderData }: Route.ComponentProps) {
	const organisation = usePreloadedQuery(loaderData.preloadedOrganisation)
	const [open, setOpen] = useState(false)

	return (
		<div className="flex h-full flex-col bg-red-200 p-12">
			<div className="mb-8 flex items-center justify-between">
				<h1>{organisation.name}</h1>
				<Button onClick={() => setOpen(true)}>organisationlid toevoegen</Button>
			</div>
			<p>This is the organisation page.</p>
			<div>
				<div className="flex items-center justify-between">
					<h2>Leden</h2>
				</div>
			</div>
			
		</div>
	)
}

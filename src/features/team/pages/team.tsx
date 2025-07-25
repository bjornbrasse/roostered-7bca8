import { preloadQuery } from 'convex/nextjs'
import { usePreloadedQuery } from 'convex/react'
import { useState } from 'react'

import { Button } from '#app/components/ui/button.tsx'
import { TeamMemberDialog } from '#app/features/team/resources/team-member-dialog.tsx'
import { api } from '../../../../convex/_generated/api'
import { type Route } from './+types/team.ts'

export async function loader({ params }: Route.LoaderArgs) {
	const preloadedTeam = await preloadQuery(api.team.get, {
		teamId: params.teamId,
	})
	return { preloadedTeam }
}

export default function TeamPage({ loaderData }: Route.ComponentProps) {
	const team = usePreloadedQuery(loaderData.preloadedTeam)
	const [open, setOpen] = useState(false)

	return (
		<div className="flex h-full flex-col bg-red-200 p-12">
			<div className="mb-8 flex items-center justify-between">
				<h1>{team.name}</h1>
				<Button onClick={() => setOpen(true)}>Teamlid toevoegen</Button>
			</div>
			<p>This is the team page.</p>
			<div>
				<div className="flex items-center justify-between">
					<h2>Leden</h2>
				</div>
			</div>
			<TeamMemberDialog open={open} onOpenChange={setOpen} teamId={team._id} />
		</div>
	)
}

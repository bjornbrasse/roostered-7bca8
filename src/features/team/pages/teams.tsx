import { Button } from '#app/components/ui/button.tsx'
import { useState } from 'react'
import { type Route } from './+types/teams.ts'
import { TeamDialog } from '#app/features/team/resources/team-dialog.tsx'
import { usePreloadedQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { preloadQuery } from 'convex/nextjs'
import { href, Link } from 'react-router'

export async function loader() {
	const preloadedTeams = await preloadQuery(api.team.list)
	return { preloadedTeams }
}

export default function TeamsPage({ loaderData }: Route.ComponentProps) {
	const [open, setOpen] = useState(false)

	const teams = usePreloadedQuery(loaderData.preloadedTeams)

	return (
		<div className="flex h-full flex-col p-12">
			<div className="mb-8 flex items-center justify-between">
				<h1>Teams Page</h1>
				<Button onClick={() => setOpen(true)}>Nieuw</Button>
			</div>
			<div className="flex-1x">
				{teams?.map((team) => (
					<Link to={href('/team/:teamId', { teamId: team._id })} key={team._id}>
						<div className="cursor-pointer rounded-lg bg-gray-200 p-4 hover:scale-105">
							<h2>{team.name}</h2>
						</div>
					</Link>
				))}
			</div>
			<TeamDialog open={open} onOpenChange={setOpen} />
		</div>
	)
}

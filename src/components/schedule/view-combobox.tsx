import { Button } from '#app/components/ui/button.tsx'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '#app/components/ui/command.tsx'
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '#app/components/ui/popover.tsx'
import { cn } from '#app/utils/misc.tsx'
import { Link, useFetcher } from '@remix-run/react'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { loader } from '#app/routes/api+/view.ts'

export function ViewCombobox({
	activeViewId,
	views,
}: {
	activeViewId: string | null
	views: Array<{ id: string; name: string }>
}) {
	const fetcher = useFetcher<typeof loader>()

	const [open, setOpen] = useState(false)
	const [value, setValue] = useState<string | null>(activeViewId)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? views.find((view) => view.id === value)?.name
						: 'Selecteer view...'}
					<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Zoek..." />
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandGroup>
							{views.map((view) => (
								<CommandItem
									value={view.id}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? null : currentValue)
										setOpen(false)
										fetcher.submit(
											{ activeViewId: currentValue },
											{ method: 'POST' },
										)
									}}
									key={view.id}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === view.id ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{view.name}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					<CommandItem asChild>
						<Link to={'views/new'}>Maak Nieuwe Weergave</Link>
					</CommandItem>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

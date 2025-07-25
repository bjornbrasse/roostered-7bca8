import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '#app/components/ui/dialog.tsx'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { z } from 'zod'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { href, useFetcher } from 'react-router'
import { Field } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	// description: z.string().optional(),
	// members: z.array(z.string()).optional(),
})

export function TeamDialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	const fetcher = useFetcher()
	const createTeam = useMutation(api.team.create)

	const [form, fields] = useForm({
		id: 'team-dialog',
		constraint: getZodConstraint(schema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema })
		},
		shouldValidate: 'onBlur',
	})

	useEffect(() => {
		console.log('FDS', props.open)
	}, [props])

	return (
		<Dialog {...props}>
			<DialogContent>
				<DialogTitle>Create team</DialogTitle>
				<DialogDescription className="sr-only">
					Make a new team.
				</DialogDescription>
				<fetcher.Form
					{...getFormProps(form)}
					method="POST"
					action={href('/team-dialog')}
				>
					<Field
						labelProps={{
							htmlFor: fields.name.id,
							children: 'Username or Email',
						}}
						inputProps={{
							autoFocus: true,
							...getInputProps(fields.name, { type: 'text' }),
						}}
						errors={fields.name.errors}
					/>
					<Button
						type="button"
						onClick={(e) => {
							const form = e.currentTarget.form as HTMLFormElement | null
							const nameInput = form?.elements.namedItem('name') as HTMLInputElement | null
							void createTeam({
								name: nameInput?.value ?? '',
							})
						}}
					>
						Opslaan
					</Button>
				</fetcher.Form>
			</DialogContent>
		</Dialog>
	)
}

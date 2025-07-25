import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type * as DialogPrimitive from '@radix-ui/react-dialog'
import { useMutation } from 'convex/react'
import { useEffect } from 'react'
import { Form } from 'react-router'
import { z } from 'zod'

import { Field } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog.tsx'
import { api } from '../../../../convex/_generated/api'

const schema = z.object({
	firstName: z.string().min(1, 'Name is required'),
	lastName: z.string().min(1, 'Name is required'),
	email: z.string().email(),
})

export function TeamMemberDialog({
	button,
	teamId,
	...props
}: {
	button?: React.ReactElement<HTMLButtonElement>
	teamId: string
} & React.ComponentProps<typeof DialogPrimitive.Root>) {
	const createTeamMember = useMutation(api.team.createMember)

	const [form, fields] = useForm<z.infer<typeof schema>>({
		id: 'team-member-dialog',
		constraint: getZodConstraint(schema),
		async onSubmit(e, { submission }) {
			e.preventDefault()
			if (!submission || submission.status !== 'success') return
			await createTeamMember({
				teamId,
				user: submission.value,
			})
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema })
		},
		shouldValidate: 'onBlur',
	})

	return (
		<Dialog {...props}>
			<DialogTrigger asChild>{button}</DialogTrigger>
			<DialogContent>
				<DialogTitle>Create team member</DialogTitle>
				<DialogDescription className="sr-only">
					Make a team member.
				</DialogDescription>
				<Form {...getFormProps(form)}>
					<Field
						labelProps={{
							htmlFor: fields.firstName.id,
							children: 'First Name',
						}}
						inputProps={{
							autoFocus: true,
							...getInputProps(fields.firstName, { type: 'text' }),
						}}
						errors={fields.firstName.errors}
					/>
					<Field
						labelProps={{
							htmlFor: fields.lastName.id,
							children: 'Last Name',
						}}
						inputProps={{
							...getInputProps(fields.lastName, { type: 'text' }),
						}}
						errors={fields.lastName.errors}
					/>
					<Field
						labelProps={{
							htmlFor: fields.email.id,
							children: 'Email',
						}}
						inputProps={{
							...getInputProps(fields.email, { type: 'email' }),
						}}
						errors={fields.email.errors}
					/>
					<Button type="submit">Opslaan</Button>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

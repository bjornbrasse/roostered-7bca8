import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { Form, href, useNavigate } from 'react-router'
import { z } from 'zod'

import { Field } from '~/components/forms.tsx'
import { Button } from '~/components/ui/button.tsx'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog.tsx'
import { api } from '../../../../convex/_generated/api'

const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	nameShort: z.string().optional(),
	slug: z.string().min(1, 'Slug is required'),
})

export function OrganisationDialog({ button }: { button: React.ReactNode }) {
	const createOrganisation = useMutation(api.organisation.create)
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)

	const [form, fields] = useForm<z.infer<typeof schema>>({
		id: 'organisation-dialog',
		constraint: getZodConstraint(schema),
		async onSubmit(e, { submission }) {
			e.preventDefault()
			if (!submission || submission.status !== 'success') return
			const organisationId = await createOrganisation({
				name: submission.value.name,
				nameShort: submission.value.nameShort,
				slug: submission.value.slug,
			})
			if (organisationId) {
				await navigate(
					href('/admin/dashboard/:organisationId', { organisationId }),
					{
						replace: true,
					},
				)
			}
			setOpen(false)
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema })
		},
		shouldValidate: 'onBlur',
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{button}</DialogTrigger>
			<DialogContent>
				<DialogTitle>Create organisation</DialogTitle>
				<DialogDescription className="sr-only">
					Make a new organisation.
				</DialogDescription>
				<Form {...getFormProps(form)}>
					<Field
						labelProps={{
							htmlFor: fields.name.id,
							children: 'Name',
						}}
						inputProps={{
							autoFocus: true,
							...getInputProps(fields.name, { type: 'text' }),
						}}
						errors={fields.name.errors}
					/>
					<Field
						labelProps={{
							htmlFor: fields.nameShort.id,
							children: 'Korte naam',
						}}
						inputProps={{
							...getInputProps(fields.nameShort, { type: 'text' }),
						}}
						errors={fields.nameShort.errors}
					/>
					<Field
						labelProps={{
							htmlFor: fields.slug.id,
							children: 'Slug',
						}}
						inputProps={{
							...getInputProps(fields.slug, { type: 'text' }),
						}}
						errors={fields.slug.errors}
					/>
					<Button>Opslaan</Button>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { Form, href, useNavigate } from 'react-router'
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
import { type Doc } from '#convex/_generated/dataModel.js'

const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	organisationId: z.string().cuid2(),
	slug: z.string().min(1, 'Slug is required'),
})

export function DepartmentDialog({
	button,
	organisation,
}: {
	button: React.ReactNode
	organisation: Doc<'organisations'>
}) {
	const createDepartment = useMutation(api.department.create)
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)

	const [form, fields] = useForm<z.infer<typeof schema>>({
		id: 'department-dialog',
		constraint: getZodConstraint(schema),
		async onSubmit(e, { submission }) {
			e.preventDefault()
			if (!submission || submission.status !== 'success') return
			const departmentId = await createDepartment(submission.value)
			if (departmentId) {
				await navigate(
					href('/admin/dashboard/:organisationId/departments/:departmentId', {
						organisationId: submission.value.organisationId,
						departmentId,
					}),
					{
						replace: true,
					},
				)
			}
			setOpen(false)
		},
		onValidate({ formData }) {
			const submission = parseWithZod(formData, { schema })
			console.log('🚀 ~ onValidate ~ submission:', submission)
			return submission
		},
		shouldValidate: 'onBlur',
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{button}</DialogTrigger>
			<DialogContent>
				<DialogTitle>Create department</DialogTitle>
				<DialogDescription className="sr-only">
					Make a new department.
				</DialogDescription>
				<Form {...getFormProps(form)}>
					<input type="hidden" name="organisationId" value={organisation._id} />
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

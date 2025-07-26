import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/schedules_/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/schedules_/$id/"!</div>
}

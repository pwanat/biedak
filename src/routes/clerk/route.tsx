import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/clerk')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}

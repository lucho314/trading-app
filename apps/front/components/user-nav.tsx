// components/user-nav.tsx
import { auth } from "@/auth"
import { LogoutButton } from "./logout-button"

export default async function UserNav() {
  const session = await auth()

  if (!session) return null

  return (
    <div className="absolute top-4 right-4">
      <LogoutButton />
    </div>
  )
}

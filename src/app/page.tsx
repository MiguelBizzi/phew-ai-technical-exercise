import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { logout } from '@/server/logout-action'
import { Button } from '@/components/ui/button'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Welcome back, {data.user.email}!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">User Information</h3>
                <p className="text-sm text-gray-600">
                  Email: {data.user.email}
                </p>
                <p className="text-sm text-gray-600">User ID: {data.user.id}</p>
                <p className="text-sm text-gray-600">
                  Created: {new Date(data.user.created_at).toLocaleDateString()}
                </p>
              </div>

              <form action={logout}>
                <Button type="submit" variant="outline">
                  Sign Out
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

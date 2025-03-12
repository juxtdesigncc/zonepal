'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Something went wrong</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sorry, we encountered an error while processing your request. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
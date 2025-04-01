'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useFormState } from 'react-dom'
import { updateFullName } from './actions'
import { Pencil, Check, X } from 'lucide-react'

type FormState = {
  error?: string | null;
  message?: string | null;
}

const initialState: FormState = {
  error: null,
  message: null,
}

export default function EditableName({ initialName }: { initialName: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formState, formAction] = useFormState(updateFullName, initialState)
  const [localName, setLocalName] = useState(initialName)

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-lg">{localName}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <form
      action={async (formData: FormData) => {
        await formAction(formData);
        if (!formState?.error) {
          setIsEditing(false);
          setLocalName(formData.get('full_name') as string);
        }
      }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2">
        <Input
          name="full_name"
          defaultValue={localName}
          className="max-w-[200px]"
          autoFocus
        />
        <Button type="submit" variant="ghost" size="icon" className="h-8 w-8">
          <Check className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsEditing(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {formState?.error && (
        <Alert variant="destructive">
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      )}
      {formState?.message && (
        <Alert>
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}
    </form>
  )
} 
import React, { useState } from "react"

export const useInput = (initialValue?: string, validator?: (value: string) => boolean) => {
  const [value, setValue] = useState(initialValue)
  const onChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = evt
    let willUpdate = true
    if (validator !== undefined) {
      willUpdate = validator(value)
    }
    if (willUpdate) {
      setValue(value)
    }
  }
  return { value, onChange, setValue }
}

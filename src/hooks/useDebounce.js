import { useEffect } from "react"
import { useState } from "react"
import { useMutation } from "react-query"

export const useDebounce = (value, delay) => {
    const [valueDebounce, setValueDebounce] = useState('')
    useEffect(() => {
        const handle = setTimeout(() => {
            setValueDebounce(value)
        }, [delay])
        return () => {
            clearTimeout(handle)
        }
    }, [value])

    return valueDebounce

}

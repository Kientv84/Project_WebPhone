import { useMutation } from "react-query"

export const useMutationHooks = (fnCallBack, { onSuccess, onError, ...options } = {}) => {
    const mutation = useMutation({
        mutationFn: fnCallBack,
        onSuccess: (data, ...rest) => {
            if (onSuccess) onSuccess(data, ...rest);
        },
        onError: (error, ...rest) => {
            if (onError) onError(error, ...rest);
        },
        ...options,
    });

    return mutation;
}
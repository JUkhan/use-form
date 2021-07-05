import { useCallback, useRef, useReducer } from "react";

type ErrorStatus = "" | "success" | "warning" | "error" | "validating";

type Dispatch = (key: string, value: any) => void;
type DispatchError = (
  key: string,
  status: ErrorStatus,
  message?: string
) => void;
type FormConfig = {
  [key: string]: {
    value: any;
    status?: ErrorStatus;
    message?: string;
    validate?: (value: any, dispatch: DispatchError) => void;
  };
};
export function useForm(init?: FormConfig): {
  form: FormConfig;
  setValue: Dispatch;
  getValue: (key: string) => any;
  validate: () => boolean;
  formData: () => any;
  setFormData: (record: any) => void;
  reset: () => void;
} {
  const [_, forceRender] = useReducer(() => ({}), {});
  const state = useRef(init ?? {});
  const setError = useCallback(
    (key: string, status: ErrorStatus, message?: string) => {
      state.current[key].status = status;
      state.current[key].message = message;
    },
    []
  );

  const setValue = useCallback((key: string, value: any) => {
    if (!state.current[key]) {
      state.current[key] = { value: "" };
    }
    state.current[key].value = value;
    state.current[key].validate?.call(null, value, setError);
    forceRender();
  }, []);

  const validate = useCallback(() => {
    const keys = Object.keys(state.current);
    keys.forEach((key) => {
      state.current[key].validate?.call(
        null,
        state.current[key].value,
        setError
      );
    });
    forceRender();
    return keys.filter((key) => state.current[key].status!!).length === 0;
  }, []);

  const formData = useCallback(
    () =>
      Object.keys(state.current).reduce((acc: any, key) => {
        acc[key] = state.current[key].value;
        return acc;
      }, {}),

    []
  );
  const getValue = useCallback(
    (key: string) => state.current[key]?.value ?? "",

    []
  );
  const reset = useCallback(() => {
    Object.keys(state.current).forEach((key) => {
      state.current[key].value = "";
      state.current[key].status = "";
      state.current[key].message = "";
    });
    forceRender();
  }, []);
  const setFormData = useCallback((record: { [key: string]: any }) => {
    Object.keys(record).forEach((key) => {
      if (!state.current[key]) {
        state.current[key] = { value: "" };
      }
      state.current[key].value = record[key];
      state.current[key].status = "";
      state.current[key].message = "";
    });
    forceRender();
  }, []);
  return {
    form: state.current,
    setValue,
    validate,
    formData,
    getValue,
    setFormData,
    reset,
  };
}

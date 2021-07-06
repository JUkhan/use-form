import { useCallback, useRef, useReducer } from "react";

type ErrorStatus = "" | "success" | "warning" | "error" | "validating";

type Dispatch = (key: string, value: any) => void;

export type DispatchError = (
  key: string,
  status: ErrorStatus,
  message?: string
) => void;
export type ValidationHandler = (value: any) => [ErrorStatus, string];
type FormConfig = {
  [key: string]: {
    value: any;
    status?: ErrorStatus;
    message?: string;
    validate?: ValidationHandler;
  };
};
export function useForm(init?: FormConfig): {
  setValue: Dispatch;
  getValue: (key: string) => any;
  getStatus: (key: string) => ErrorStatus;
  getMessage: (key: string) => any;
  validate: () => boolean;
  formData: () => any;
  setFormData: (record: any) => void;
  reset: () => void;
  setError: DispatchError;
  setValidation: (key: string, validatioHandler: ValidationHandler) => void;
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
    const res = state.current[key].validate?.call(null, value);
    if (res) {
      setError(key, res[0], res[1]);
    }
    forceRender();
  }, []);

  const validate = useCallback(() => {
    const keys = Object.keys(state.current);
    keys.forEach((key) => {
      const res = state.current[key].validate?.call(
        null,
        state.current[key].value
      );
      if (res) {
        setError(key, res[0], res[1]);
      }
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
  const getStatus = useCallback(
    (key: string) => state.current[key]?.status ?? "",

    []
  );
  const getMessage = useCallback(
    (key: string) => state.current[key]?.message ?? "",

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
  const setValidation = useCallback(
    (key: string, handler: ValidationHandler) => {
      if (!state.current[key]) {
        state.current[key] = { value: "" };
      }
      state.current[key].validate = handler;
    },

    []
  );
  return {
    setValue,
    getValue,
    getStatus,
    getMessage,
    validate,
    formData,
    setFormData,
    reset,
    setError,
    setValidation,
  };
}

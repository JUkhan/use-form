# use-form

an easy, simple but robust react hook for form ui

```ts
import { useForm } from "react-formjs";
const login = () => {
  const { setValue, getValue, formData } = useForm();

  const submit = () => {
    console.log(formData());
  };
  return (
    <div>
      <input
        type="text"
        value={getValue("userName")}
        onChange={(e) => setValue("userName", e.target.value)}
      />
      <input
        type="password"
        value={getValue("password")}
        onChange={(e) => setValue("password", e.target.value)}
      />
      <button onClick={submit}>Submit</button>
    </div>
  );
};
```

Validation

```ts
import { useEffect } from "react";
import { useForm } from "react-formjs";
const login = () => {
  const {
    validate,
    setValue,
    getValue,
    formData,
    setValidation,
    getStatus,
    getMessage,
  } = useForm();

  useEffect(() => {
    setValidation("userName", (val) =>
      val ? ["", ""] : ["warning", "user name should not be empty"]
    );
    setValidation("password", (val) =>
      val ? ["", ""] : ["warning", "password should not be empty"]
    );
  }, []);

  const submit = () => {
    if (validate()) console.log(formData());
  };
  return (
    <div>
      <div className={getStatus("userName")}>{getMessage("userNamme")}</div>
      <div className={getStatus("password")}>{getMessage("password")}</div>
      <input
        type="text"
        value={getValue("userName")}
        onChange={(e) => setValue("userName", e.target.value)}
      />
      <input
        type="password"
        value={getValue("password")}
        onChange={(e) => setValue("password", e.target.value)}
      />
      <button onClick={submit}>Submit</button>
    </div>
  );
};
```

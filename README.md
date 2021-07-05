# use-form

an easy, simple but robust react hook for form ui

```ts
import { useForm } from "use-form";
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
import { useForm } from "use-form";
const login = () => {
  const { form, setValue, getValue, formData, validate } = useForm({
    userName: {
      value: "",
      validate(val, setError) {
        !val || val.length > 3
          ? setError(
              "userName",
              "error",
              "user name should not be empty and bigger than 2 char"
            )
          : setError("userName", "", "");
      },
    },
  });

  const submit = () => {
    if (validate()) console.log(formData());
  };
  return (
    <div>
      <div classNames={form.userName.status}>{form.userName.message}</div>
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

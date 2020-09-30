import * as React from 'react';
import { useForm } from 'react-hook-form';

// Einfaches react-hook-form Beispiel
export default function App() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="username" name="username" ref={register({ required: true })} />
      <input type="password" placeholder="password" name="password" ref={register({ required: true })} />

      <input type="submit" />
    </form>
  );
}

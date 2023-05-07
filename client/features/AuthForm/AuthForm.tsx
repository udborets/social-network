import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthTypes } from "./models";

const AuthForm = () => {
  const [authType, setAuthType] = useState<AuthTypes>(AuthTypes.REGISTRATION);
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    }
  } = useForm({
  });
  const submitForm = (data: any) => {
    console.log(data);
    reset()
  }
  return (
    <form
      className="max-w-[500px] flex w-full flex-col outline outline-2 outline-[var(--blue)] rounded-[20px] p-4 gap-4"
      onSubmit={handleSubmit(submitForm)}
    >
      <h2 className="font-bold text-[1.3rem]">
        {authType === AuthTypes.REGISTRATION
          ? 'Registration'
          : 'Authorization'}
      </h2>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col text-[1.2rem] font-bold">
          Username
          <input
            className="rounded-[8px] outline outline-1 outline-[var(--blue)] px-2 py-1 text-[1rem] font-normal"
            type="text"
            {...register('username', {
              required: 'Pass valid username'
            })}
          />
          <span className="min-h-[30px] text-red-600 text-[1rem]">
            {errors?.username?.message?.toString()}
          </span>
        </label>
        <label className="flex flex-col text-[1.2rem] font-bold">
          Email
          <input
            className="rounded-[8px] outline outline-1 outline-[var(--blue)] px-2 py-1 text-[1rem] font-normal"
            type="text"
            {...register('email', {
              required: 'Pass valid email'
            })}
          />
          <span className="min-h-[30px] text-red-600 text-[1rem]">
            {errors?.email?.message?.toString()}
          </span>
        </label>
        <label className="flex flex-col text-[1.2rem] font-bold">
          Password
          <input
            className="rounded-[8px] outline outline-1 outline-[var(--blue)] px-2 py-1 text-[1rem] font-normal"
            type="text"
            {...register('password', {
              required: 'Pass valid password'
            })}
          />
          <span className="min-h-[30px] text-red-600 text-[1rem]">
            {errors?.password?.message?.toString()}
          </span>
        </label>
      </div>
      <input
        className="text-white bg-blue text-bold w-fit px-2 py-1 rounded-[10px] hover:bg-blue-hover active:bg-blue-active transition-all duration-300"
        value={`${authType === AuthTypes.REGISTRATION
          ? 'Register'
          : 'Login'}`}
        type="submit"
      />
      <div className="flex gap-2 text-[0.9rem]">
        <span>
          {authType === AuthTypes.AUTHORIZATION ? `Don't have an account?` : 'Already have an account?'}
        </span>
        <button
          className="text-blue"
          onClick={() => setAuthType(authType === AuthTypes.AUTHORIZATION ? AuthTypes.REGISTRATION : AuthTypes.AUTHORIZATION)}
        >
          {authType === AuthTypes.AUTHORIZATION ? 'Create one!' : 'Login!'}
        </button>
      </div>
    </form>
  )
}

export default AuthForm
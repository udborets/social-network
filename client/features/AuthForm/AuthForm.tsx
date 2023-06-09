import axios, { AxiosError } from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from 'uuid';

import avatarImage from '@/assets/avatarImage.png';
import { DBUser } from "@/db/models";
import BackToButton from "@/features/BackToButton/BackToButton";
import { storage } from "@/firebase";
import { useUserState } from "@/hooks/useUserState";
import { userState } from "@/store/User";
import LogoutButton from "../LogoutButton/LogoutButton";
import SpinnerModalWindow from "../SpinnerModalWindow/SpinnerModalWindow";
import FormInput from "./FormInput/FormInput";
import { AuthTypes } from "./models";

const AuthForm: FC = observer(() => {
  const router = useRouter();
  const [authType, setAuthType] = useState<AuthTypes>(AuthTypes.REGISTRATION);
  const [fetchError, setFetchError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>(null);
  const [isLogout, setIsLogout] = useState<boolean>(false);
  const { localStorageUser, setUser } = useUserState();
  useEffect(() => {
    if (localStorageUser.id !== '') {
      setIsLogout(true);
    }
  }, [])
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    }
  } = useForm();
  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  }
  if (isLogout) {
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <span className="text-[2rem]">
          Logged in as {userState.info.name}
        </span>
        <BackToButton
          href={`/users/${userState.info.id}`}
          className="text-[1.5rem]"
          text='Back to my page!'
        />
        <LogoutButton fn={() => setIsLogout(false)} className="text-[1.5rem]" />
      </div>
    )
  }
  const submitForm = async (userData: Record<string, string>) => {
    const currentAuthType = authType;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("can't get backend url");
      return;
    }
    try {
      const userId = v4();
      setIsLoading(true);
      let downloadUrl = null;
      if (avatar?.name) {
        const avatarRef = ref(storage, `avatars/${userId}.${avatar?.name?.split('.').at(-1) ?? 'png'}`);
        const uploadResult = await uploadBytes(avatarRef, avatar);
        downloadUrl = await getDownloadURL(uploadResult.ref);
      }
      const trimmedData = Object
        .keys(userData)
        .reduce((trimmedValuesObject, key) => ({ ...trimmedValuesObject, [key]: trimmedValuesObject[key].trim() }), userData);
      const response = await axios.post<{
        OK: boolean;
        message: string;
        user: DBUser;
      }>(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}/auth/${currentAuthType.toLowerCase()}`,
        { ...trimmedData, id: userId, avatarUrl: downloadUrl });
      if (response.data.OK) {
        setUser({ ...response.data.user });
        if (currentAuthType === AuthTypes.AUTHORIZATION) {
          router.push(`/users/${response.data.user.id}`);
          return;
        }
        setIsLoading(false);
        router.push(`/users/${response.data.user.id}`);
        reset();
        return;
      }
      setIsLoading(false);
      setFetchError(response.data.message);
    }
    catch (e: unknown) {
      console.error(e);
      if (e instanceof AxiosError) {
        setFetchError('Fetching error');
      }
    }
  }
  return (
    <>
      <form
        className="max-w-[500px] flex w-full flex-col outline outline-2 outline-[var(--blue)] rounded-[20px] p-4 gap-4"
        onSubmit={handleSubmit(submitForm)}
      >
        <h2 className="font-bold text-[2rem] mb-[20px] text-center">
          {authType === AuthTypes.REGISTRATION
            ? 'Registration'
            : 'Authorization'}
        </h2>
        <div className="flex flex-col gap-2">
          {authType === AuthTypes.REGISTRATION ?
            <>
              <label
                htmlFor="file-upload"
                className="items-center self-center flex gap-3 text-[1.2rem] font-bold"
              >
                Profile image
                <input
                  onChange={handleAvatarUpload}
                  id="file-upload"
                  type="file"
                  className="hidden w-[20px] h-[20px]"
                  accept="image/jpeg, image/png"
                />
                {avatar
                  ? <div className="w-[70px] h-[70px] rounded-[50%] outline outline-1 grid place-items-center ">
                    <span className="text-[0.8rem]">Your image</span>
                  </div>
                  : <Image
                    src={avatarImage}
                    alt="avatar"
                    className="w-[70px] h-[70px]  rounded-[50%]"
                    height={70}
                    width={70}
                    style={{ height: 'auto', objectFit: 'contain', position: 'relative' }}
                  />
                }
              </label>
              <FormInput
                errors={errors}
                register={register}
                registerName="name"
                text="Username"
                required="Pass valid username"
              />
              <FormInput
                errors={errors}
                register={register}
                registerName="email"
                text="Email"
                required="Pass valid email"
              />
              <FormInput
                errors={errors}
                register={register}
                registerName="password"
                text="Password"
                required="Pass valid password"
                isPassword
              />
            </>
            : <>
              <FormInput
                errors={errors}
                register={register}
                registerName="email"
                text="Email"
                required="Pass valid email"
              />
              <FormInput
                errors={errors}
                register={register}
                registerName="password"
                text="Password"
                required="Pass valid password"
                isPassword
              />
            </>}
        </div>
        <div className="flex w-full h-fit gap-8 items-center">
          <input
            className="text-white bg-blue text-bold text-[1.2rem] w-fit px-3 py-2 rounded-[10px] hover:bg-blue-hover active:bg-blue-active transition-all duration-300"
            value={`${authType === AuthTypes.REGISTRATION
              ? 'Register'
              : 'Login'}`}
            type="submit"
          />
          <span className="text-red-600 text-bold">{fetchError ?? ''}</span>
        </div>
        <div className="flex gap-2 text-[1.1rem]">
          <span>
            {authType === AuthTypes.AUTHORIZATION ?
              `Don't have an account?` :
              'Already have an account?'}
          </span>
          <button
            className="text-blue font-bold"
            onClick={(e) => {
              e.preventDefault();
              setAuthType(authType === AuthTypes.AUTHORIZATION
                ? AuthTypes.REGISTRATION
                : AuthTypes.AUTHORIZATION)
            }}
          >
            {authType === AuthTypes.AUTHORIZATION ? 'Create one!' : 'Login!'}
          </button>
        </div>
      </form>
      {isLoading
        ? <SpinnerModalWindow />
        : ''}
    </>
  )
})

export default AuthForm
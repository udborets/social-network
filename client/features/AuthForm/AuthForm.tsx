import axios, { AxiosError } from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from 'uuid';

import avatarImage from '@/assets/avatarImage.png';
import { DBUser } from "@/db/models";
import { storage } from "@/firebase";
import { userState } from "@/store/User";
import { AuthTypes } from "./models";
import styles from './styles.module.scss';

const AuthForm = observer(() => {
  const router = useRouter();
  const [authType, setAuthType] = useState<AuthTypes>(AuthTypes.REGISTRATION);
  const [fetchError, setFetchError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>(null);
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
      setAvatar(e.target.files[0])
    }
  }

  const submitForm = async (userData: object) => {
    const currentAuthType = authType;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("can't get backend url");
      return
    }
    try {
      const userId = v4();
      setIsLoading(true);
      const response = await axios.post<{
        OK: boolean;
        message: string;
        user: DBUser;
      }>(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}/auth/${currentAuthType.toLowerCase()}`, { ...userData, id: userId });
      if (response.data.OK) {
        if (avatar?.name) {
          const avatarRef = ref(storage, `avatars/${userId}.${avatar?.name?.split('.').at(-1) ?? 'png'}`);
          const uploadResult = await uploadBytes(avatarRef, avatar ?? avatarImage);
          userState.setState({ ...response.data.user, avatarUrl: await getDownloadURL(uploadResult.ref) });
          router.push(`/user/${response.data.user.id}`);
          return;
        }
        if (!avatar?.name) {
          userState.setState({ ...response.data.user });
          router.push(`/user/${response.data.user.id}`);
          return;
        }
        reset();
      }
      setIsLoading(false);
      setFetchError(response.data.message);
    }
    catch (e: unknown) {
      console.log(e)
      if (e instanceof AxiosError) {
        console.error(e);
        setFetchError('Fetching error')
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
              <label className="flex flex-col text-[1.2rem] font-bold">
                <span><span className="text-red-700">*</span>Username</span>
                <input
                  className="rounded-[8px] outline outline-1 outline-[var(--blue)] px-2 py-1 text-[1rem] font-normal"
                  type="text"
                  {...register('name', {
                    required: 'Pass valid username'
                  })}
                />
                <span className="min-h-[30px] text-red-600 text-[1rem]">
                  {errors?.name?.message?.toString()}
                </span>
              </label>
            </>
            : ''}
          <label className="flex flex-col text-[1.2rem] font-bold">
            <span><span className="text-red-700">*</span>Email</span>
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
            <span><span className="text-red-700">*</span>Password</span>
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
        ? <div className={`absolute w-full h-full grid place-items-center z-[10] bg-[#00000086]`}>
          <div className={`${styles.spinner}`} />
        </div>
        : ''}
    </>
  )
})

export default AuthForm
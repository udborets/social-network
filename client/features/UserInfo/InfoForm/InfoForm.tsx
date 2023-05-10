import axios from "axios";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { userState } from "@/store/User";
import InfoInput from "./InfoInput/InfoInput";

const InfoForm: FC = observer(() => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const submit = async (data: any) => {
    try {
      setIsLoading(true);
      console.log(data)
      const a = await axios.post((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/users/update', {
        id: userState.info.id, univ: data.univ, age: data.age, city: data.city
      });
      console.log(a);
      setIsLoading(false);
      reset();
    }
    catch (e) {
      console.error(e);
    }
  }
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={handleSubmit(submit)}
    >
      <h4 className="font-bold text-[1.1rem]">
        Update your information
      </h4>
      <InfoInput
        name="age"
        placeholder="Enter your age..."
        registerFn={register}
        text="Age"
        type="number"
      />
      <InfoInput
        name="city"
        placeholder="Enter your city..."
        registerFn={register}
        text="City"
        type="text"
      />
      <InfoInput
        name="univ"
        placeholder="Enter your university..."
        registerFn={register}
        text="University"
        type="text"
      />
      <input
        type="submit"
        value="Update my info"
        disabled={isLoading}
        className="outline-[var(--blue)] outline hover:bg-blue-hover hover:text-white disabled:bg-slate-800 mt-[10px] px-1 py-2 rounded-[20px]"
      />
    </form>
  )
})

export default InfoForm
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

import { storage } from "@/firebase";
import { userState } from "@/store/User";

const PostField: FC = observer(() => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chosenFile, setChosenFile] = useState<File>();
  const {
    register,
    handleSubmit,
    reset,
    formState: {
    }
  } = useForm();
  const submit = async ({ text }: any) => {
    let imageUrl = null;
    if (chosenFile) {
      const imageRef = ref(storage, `posts/${v4()}`);
      const uploadResult = await uploadBytes(imageRef, chosenFile);
      imageUrl = await getDownloadURL(uploadResult.ref);
    }
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
    try {
      if (text || imageUrl) {
        setIsLoading(true);
        await axios.post(backendUrl + "/posts/create",
          { ownerId: userState.info.id, imageUrl: imageUrl, text: text });
        reset();
        setIsLoading(false);
      }
    }
    catch (e) {
      console.error(e);
    }
  }
  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-2"
    >
      <span className="font-bold text-[1.2rem]">
        Create post
      </span>
      <textarea
        placeholder="Enter post text..."
        className="outline max-w-[600px] outline-[var(--blue)] p-2 rounded-[10px]"
        {...register('text')}
      />
      <input
        onChange={(e: any) => setChosenFile(e.target.files[0])}
        type="file"
        accept="image/png, image/jpeg"
      />
      <input
        className="p-2 rounded-[10px] outline-[var(--blue)] duration-300 transition-all outline hover:bg-blue-hover active:bg-blue-active disabled:bg-slate-600"
        disabled={isLoading}
        value='Post!'
        type="submit"
      />
    </form>
  )
})

export default PostField
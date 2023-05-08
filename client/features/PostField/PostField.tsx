import { storage } from "@/firebase";
import { userState } from "@/store/User";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { v4 } from "uuid";

const PostField = observer(() => {
  const [chosenFile, setChosenFile] = useState<File>();
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    }
  } = useForm();
  const submit = async ({ text }: any) => {
    let imageUrl = null;
    if (chosenFile) {
      const imageRef = ref(storage, `posts/${v4()}`);
      const uploadResult = await uploadBytes(imageRef, chosenFile);
      imageUrl = await getDownloadURL(uploadResult.ref);
    }
    console.log(imageUrl)
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
    try {
      if (text || imageUrl) {
        const createdPost = await axios.post(backendUrl + "/posts/create",
          { ownerId: userState.info.id, imageUrl: imageUrl, text: text });
        console.log(createdPost);
        console.log(text)
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
      <label
        htmlFor=""
        className="flex flex-col"
      >
        haha
        <textarea
          className="outline-1 outline"
          {...register('text')}
        />
      </label>
      <label htmlFor="">
        <input
          onChange={(e: any) => setChosenFile(e.target.files[0])}
          type="file"
          accept="image/png, image/jpeg"
        />
      </label>
      <input
        className=""
        value='hha'
        type="submit"
      />
    </form>
  )
})

export default PostField
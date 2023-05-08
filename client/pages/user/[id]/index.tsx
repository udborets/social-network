import { userState } from "@/store/User";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router"

const UserIdPage = observer(() => {
  const { query } = useRouter();
  const isOwn = userState.info.id === query.id
  return (
    <main>

    </main>
  )
})

export default UserIdPage;
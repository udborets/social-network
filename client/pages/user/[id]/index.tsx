import { useRouter } from "next/router"

const UserIdPage = () => {
  const a = useRouter();
  return (
    <div>{a.query.id}</div>
  )
}

export default UserIdPage;
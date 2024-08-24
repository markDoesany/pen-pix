import { Link } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { UserAtom } from "../atoms/UserAtom"
import style from './styles/links.module.css'

const Links = () => {
  const user = useRecoilValue(UserAtom)

  return (
    <ul className="flex gap-5 font-semibold">
      <Link to={`/dashboard/${user?.id}`} className={style.link}> Dashboard </Link>
      <Link to={"#"} className={style.link}> Classes </Link>
      <Link to={"#"} className={style.link}> About </Link>
      <Link to={"#"} className={style.link}> Contact </Link>
    </ul>
  )
}

export default Links
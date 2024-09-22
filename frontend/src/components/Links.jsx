import { Link, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserAtom } from "../atoms/UserAtom";
import style from './styles/links.module.css';

const Links = () => {
  const user = useRecoilValue(UserAtom);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <ul className={style.container}>
      <Link 
        to={`/dashboard/${user?.id}`} 
        className={`${style.link} ${isActive(`/dashboard/${user?.id}`) ? style.active : ''}`}
      >
        Dashboard
      </Link>
      <Link 
        to={`/classes/${user?.id}`} 
        className={`${style.link} ${isActive(`/classes/${user?.id}`) ? style.active : ''}`}
      >
        Classes
      </Link>
      <Link 
        to="#" 
        className={`${style.link} ${isActive("#") ? style.active : ''}`}
      >
        About
      </Link>
      <Link 
        to="#" 
        className={`${style.link} ${isActive("#") ? style.active : ''}`}
      >
        Contact
      </Link>
    </ul>
  );
};

export default Links;

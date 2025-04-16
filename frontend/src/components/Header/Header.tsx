import { ToggleTheme } from "../ToggleTheme/ToggleTheme";
import styles from "./styles.module.scss";
import { NavLink } from "react-router-dom";

export const Header = () => {
  const linkClass = ({ isActive }: any) => (isActive ? styles.active : "");

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header_inner}>
          <nav>
            <ul className={styles.menu}>
              <li>
                <NavLink to="/" className={linkClass}>
                  Карта
                </NavLink>
              </li>
              <li>
                <NavLink to="/objects" className={linkClass}>
                  Объекты
                </NavLink>
              </li>
              <li>
                <NavLink to="/employees" className={linkClass}>
                  Сотрудники
                </NavLink>
              </li>
              <li>
                <NavLink to="/incidents" className={linkClass}>
                  Инциденты
                </NavLink>
              </li>
              <li>
                <NavLink to="/types" className={linkClass}>
                  Справочники типов
                </NavLink>
              </li>
              <li>
                <NavLink to="/rab" className={linkClass}>
                  РЭБ
                </NavLink>
              </li>
            </ul>
          </nav>
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
};

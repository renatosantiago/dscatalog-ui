import { Link, NavLink, } from 'react-router-dom';
import './styles.scss';

const NavBar = () => {
  const currentUser = 'renato';

  return (
    <nav className="row bg-primary main-nav">
      <div className="col-3">
        <Link to="/" className="nav-logo-text">
          <h4>DS Catalog</h4>
        </Link>
      </div>
      <div className="col-6">
        <ul className="main-menu">
          <li>
            <NavLink to="/" activeClassName="active" exact className="nav-link">
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" activeClassName="active" className="nav-link">
              CATALOGO
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin" activeClassName="active" className="nav-link">
              ADMIN
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="col-3 text-right">
        {currentUser && (
          <>
            { currentUser }
            <a
              href="#logout"
              className="nav-link active d-inline"
            >
              LOGOUT
            </a>
          </>
        )}
        {!currentUser && (
          <Link to="/auth/login" className="nav-link active">
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  )
};

export default NavBar;
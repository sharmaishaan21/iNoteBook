import React,{useEffect} from 'react'
import {Link,useLocation,useHistory} from "react-router-dom";

const Navbar = () => {
    let history=useHistory();
    const handleLogout=()=>{
        localStorage.removeItem('token');
        history.push("/login");
    }
    let location = useLocation();// useLocation() hook returns the location object that represents the current URL.
    useEffect(() => {
        console.log(location.pathname);
      }, [location]);// The array contains the dependencies according to which the callback function has to be implemented. In this situation, the callback funtion funtion will only be implemented if and only if there is a change in the location.
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">iNotebook</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/about"?"active":""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/"?"active":""}`} to="/about">About</Link>
                        </li>
                    </ul>
                    {!localStorage.getItem('token')?<form className="d-flex">
                        <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
                        <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
                    </form>:<button onClick={handleLogout} className="btn btn-primary">Logout</button> }
                </div>
            </div>
        </nav>
    )
}

export default Navbar

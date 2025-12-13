// Navbar.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom'; // ✅ ADD THIS IMPORT
import { login, logout } from "../slices/authSlice.js";

function Navbar() {
    const userstate = useSelector((state) => state.user);
    console.log("User State in Navbar:", userstate);
    const dispatch = useDispatch();

    return (
        <nav style={{ padding: "10px", backgroundColor: "#282c34", color: "white" }}>
            <h2>🛒 My E-Commerce Store</h2>
            <ul style={{ listStyle: "none", display: "flex", gap: "15px", margin: 0, padding: 0 }}>
                {/* ✅ REPLACE ALL <a> TAGS WITH <Link> */}
                <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link></li>
                <li><Link to="/stocks" style={{ color: "white", textDecoration: "none" }}>Stocks</Link></li>
                
                {!userstate.isAuthenticated ? (
                    <li><Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link></li>
                ) : (
                    <li>
                        <Link 
                            to="/" 
                            style={{ color: "white", textDecoration: "none" }}
                            onClick={() => dispatch(logout())}
                        >
                            Logout
                        </Link>
                    </li>
                )}
                
                <li><Link to="/create" style={{ color: "white", textDecoration: "none" }}>Create Stock</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
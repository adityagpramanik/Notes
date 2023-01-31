import { CgProfile } from "react-icons/cg";
import axios from "axios";

export default function Profile(props) {
    const logout = (e) => {
        e.preventDefault();
        axios.get('http://localhost:3001/logout').then((response)=> {
            if (response && response.status === 200) {
                document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                alert('Logged out');
            }
        }).catch((err) => {
            alert('error: ', err);
        });
    }
    return (
        <div>
        <CgProfile style={{color: "white", margin: "10px"}}></CgProfile>
        <button onClick={logout}>Logout</button>
        </div>
    );
}
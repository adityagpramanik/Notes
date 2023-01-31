import './NavBar.css';
import Profile from './Profile';

export default function NavBar(props) {
    return (
        <nav className="topnavbar">
            <div style={{width: "30%"}}>
                <ul style={{display: "flex"}}>
                    <li style={{listStyle: "none", float: "right"}}>
                        <button className="button-37" onClick={(e) => props.filter([])}>
                            Home
                        </button>
                    </li>
                </ul>
            </div>
            <div className="nav-header">
                Notes App
            </div>
            <div style={{width: "30%"}}>
                <ul style={{display: "flex", flexDirection: "row-reverse", marginRight: "20px"}}>
                    <li style={{listStyle: "none", padding: "0px 20px"}}>
                        <Profile>
                        </Profile>
                    </li>
                    <li style={{listStyle: "none", padding: "0px 20px"}}>
                        <button className="button-37" style={{}} onClick={(e) => props.filter(['me'])}>
                        My Notes    
                        </button>
                    </li>
                    <li style={{listStyle: "none", padding: "0px 20px"}}>
                        <button className="button-37" onClick={(e) => props.filter(['all'])}>
                        All Notes
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
import './Note.css';

export default function Note(props) {
    return (
        <div className="card">
            <div style={{ height: "70%" }}>
                <h3 className="card-title">
                    {props.head}
                </h3>
                <p className="card-content">
                    {props.body}
                </p>
            </div>
            <div style={{
                height: "30%", display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column"
            }}>
                <ul className="tags">
                    {props.tags.map((tag) => {
                        return (
                            <li className="tag">
                                {tag}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
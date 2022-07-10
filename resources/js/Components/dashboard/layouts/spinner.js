const Spinner = (props) => {
    return (
        <div
            className={`spinner-border ${props.size} ${props.color} text-center mx-auto`}
            role="status"
        >
            <span className="visually-hidden">Loading...</span>
        </div>
    );
};
export default Spinner;

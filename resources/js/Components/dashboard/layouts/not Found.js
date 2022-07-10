import img from "../../../assets/img/search.png";
const NotFound = (props) => {
    return (
        <>
            <div
                className="row flew-column align-items-center justify-content-center"
                data-aos="fade-up"
                data-aos-duration="700"
            >
                <span className="text-center color-3 mb-3">
                    {" "}
                    {props.text}
                </span>
                <img src={img} className={"img-fluid w-50 image"} />
            </div>
        </>
    );
};

export default NotFound;

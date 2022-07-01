const Modals = (props) => {
    return (
        <>
            <div
                className="modal fade"
                id={props.modalID}
                tabIndex="0"
                aria-labelledby=""
                aria-hidden="true"
            >
                <div className={`modal-dialog ${props.size}`}>
                    <div
                        className="modal-content"
                        style={{ borderRadius: "30px " }}
                    >
                        <div
                            className="modal-body bg-color-2"
                            style={{ borderRadius: "30px " }}
                        >
                            <button
                                type="button"
                                className="btn"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                style={{ position: "absolute", float: "right" }}
                            >
                                <i className="fad fa-minus"></i>
                            </button>
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Modals;

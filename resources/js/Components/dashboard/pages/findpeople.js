import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { user } from "../../../constants";
import Contact from "../layouts/contact";
import NotFound from "../layouts/not Found";
import Spinner from "../layouts/spinner";
import { allusers } from "../scripts/Queries";

const FindPeople = (props) => {
    const Page_Size = 4;
    const path = useParams();
    const pageNo = parseInt(path.page);
    const All = useQuery(allusers, {
        variables: {
            id: user.id,
            first: Page_Size,
            page: pageNo,
        },
    });
    return (
        <>
            <div className="d-flex align-items-center justify-content-center mt-2 mb-4 ">
                <span className="border-1 w-100 color-1" style={{ borderBottom: "2px solid red" }}></span>
                <span className="mx-2 text-muted">Find peoples</span>
                <span className="border-1 w-100" style={{ border: "1px solid #eee" }}></span>
            </div>
            <div className="col" data-aos="fade-up-left" data-aos-duration="500" data-aos-once="false">
                <div id="main-content" className=" bg-transparent d-flex flex-row flex-wrap align-items-center justify-content-around">
                    <div className="input-group  bg-white border-1 rounded-pill mb-2 p-2 shadow-sm" style={{ border: "1px solid #ccc" }}>
                        <input className="form-control border-0 shadow-none bg-transparent" placeholder="Search" onInput={(e) => HandleSearch(e)} />
                        <button className="btn  text-success">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                    {/* {searchRslt.data != null ? (
                        <>
                            {searchRslt.data.search.length > 0 ? (
                                <>
                                    {searchRslt.data.search.map((usr) => {
                                        return <Contact user={{ user: usr }} />;
                                    })}
                                </>
                            ) : (
                                <NotFound text="No user found" />
                            )}
                        </>
                    ) : ( */}
                    <>
                        {" "}
                        {All.loading ? (
                            <Spinner color="color-3" />
                        ) : All.error ? (
                            <>{All.error.message}</>
                        ) : All.data.allusers.data.length == 0 ? (
                            <NotFound text="There is no user yet" />
                        ) : (
                            All.data.allusers.data.map((e) => {
                                if (e.id != user.id) return <Contact no={e.id} user={{ user: e }} />;
                            })
                        )}
                    </>
                </div>
            </div>
            {All.loading ? (
                <Spinner />
            ) : (
                <nav aria-label="..." className="mx-auto text-center d-flex align-items-center justify-content-center ">
                    <ul className="pagination">
                        <li className={`page-item ${pageNo == 1 ? "disabled " : ""}`}>
                            <NavLink className="page-link color-6" to={`/FindPeoples/${pageNo - 1}`}>
                                Previous
                            </NavLink>
                        </li>
                        {/* {All.loading ? <Spinner /> :
                         All.data.allusers.paginatorInfo.
                    
                       } */}

                        {(() => {
                            let no = All.data.allusers.paginatorInfo.total / Page_Size;
                            const items = [];
                            for (let j = 0; j < Math.ceil(no); j++) {
                                items.push(
                                    <li key={j} className={`page-item ${j + 1 == pageNo ? "active" : ""}`} aria-current="page">
                                        <NavLink to={`/FindPeoples/${j + 1}`}>
                                            <span className="page-link">{j + 1}</span>
                                        </NavLink>
                                    </li>
                                );
                            }
                            return items;
                        })()}

                        <li className={`page-item ${All.data.allusers.paginatorInfo.hasMorePages ? "" : "disabled"} `}>
                            <NavLink className="page-link color-6" to={`/FindPeoples/${pageNo + 1}`}>
                                Next
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    );
};

export default FindPeople;

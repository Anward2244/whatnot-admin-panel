import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Input, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import ReactPaginate from "react-paginate"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import gig from "../../assets/images/what.gif"

function Ventures() {
  const [Actin, setActin] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token
  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    GetPromoters()
    datass()
  }, [])

  const GetPromoters = () => {
    var token = datas
    axios
      .post(
        URLS.FeedBack,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setActin(res.data.data)
        setIsLoading(false)
      })
  }

  const pagesVisited = pageNumber * listPerPage
  const lists = Actin.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Actin.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const datass = () => {
    const location = sessionStorage.getItem("tost")
    if (location != "") {
      toast(location)
      sessionStorage.clear()
    } else {
      sessionStorage.clear()
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Whatnot" breadcrumbItem="Employee FeedBack" />

          <Row>
            <Col>
              <Card>
                {isLoading == true ? (
                  <>
                    <div
                      style={{ zIndex: "9999999999999", height: "420px" }}
                      className="text-center mt-5 pt-5"
                    >
                      <img src={gig} height="140px"></img>
                      <div>Loading......</div>
                    </div>
                  </>
                ) : (
                  <>
                    <CardBody>
                      <div className="table-rep-plugin mt-4 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr className="text-center">
                              <th>SlNo</th>
                              <th>Employee Image</th>
                              <th>Employee Store Name</th>
                              <th>Employee Name</th>
                              <th>Employee Number</th>
                              <th>Message</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lists.map((data, key) => (
                              <tr key={key} className="text-center">
                                <td>{(pageNumber - 1) * 5 + key + 6}</td>
                                <td>
                                  <img
                                    src={URLS.Base + data.promoterProfilePic}
                                    className=" rounded-circle"
                                    style={{ height: "50px", width: "50px" }}
                                  />
                                </td>
                                <td>{data.promoterStoreName}</td>
                                <td>{data.promoterName}</td>
                                <td>{data.promoterMobile}</td>
                                <td>{data.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <div
                          className="d-flex mt-3 mb-1"
                          style={{ float: "right" }}
                        >
                          <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            pageCount={pageCount}
                            onPageChange={changePage}
                            containerClassName={"pagination"}
                            previousLinkClassName={"previousBttn"}
                            nextLinkClassName={"nextBttn"}
                            disabledClassName={"disabled"}
                            activeClassName={"active"}
                            total={lists.length}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </>
                )}
              </Card>
            </Col>
          </Row>
          <ToastContainer />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Ventures

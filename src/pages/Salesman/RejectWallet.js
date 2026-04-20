import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Table,Input } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import ReactPaginate from "react-paginate"
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
    GetAtps()
  }, [])

  const GetAtps = () => {
    var token = datas
    axios
      .post(
        URLS.GetRejectAllWalletPayment,
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

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const [form1, setform1] = useState([])

  const Search = e => {
    const myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)

    const token = datas
    console.log(token)

    axios
      .post(
        URLS.GetRejectAllWalletPaymentSearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setActin(res.data.data)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Whatnot"
            breadcrumbItem="Employee Reject Wallet Request"
          />

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
                      <Row>
                        <Col>
                          <div style={{ float: "right" }}>
                            <Input
                              name="search"
                              value={form1.search}
                              onChange={Search}
                              type="search"
                              placeholder="Search..."
                            />
                          </div>
                        </Col>
                      </Row>
                      <div className="table-rep-plugin mt-4 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr className="text-center">
                              <th>SlNo</th>
                              <th>Date / Time</th>
                              <th>Employee Store Name</th>
                              <th>Employee Image</th>
                              <th>Employee Name</th>
                              <th>Employee Number</th>
                              <th>Employee Email</th>
                              <th>Wallet Request </th>
                              <th>Reject Reason </th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lists.map((data, key) => (
                              <tr key={key} className="text-center">
                                <td>{(pageNumber - 1) * 5 + key + 6}</td>
                                <td>
                                  {data.date}/{data.time}
                                </td>
                                <td>{data.promoterStoreName}</td>
                                <td>
                                  <img
                                    src={URLS.Base + data.promoterProfilePic}
                                    alt=""
                                    className=" rounded-circle"
                                    style={{ height: "50px", width: "50px" }}
                                  />
                                </td>
                                <td>{data.promoterName}</td>
                                <td>{data.promoterMobile}</td>
                                <td>{data.promoterEmail}</td>
                                <td>{data.amount}</td>
                                <td>{data.reason}</td>
                                <td>
                                  <span className="badge bg-danger ">
                                    {data.status}
                                  </span>
                                </td>
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
        </div>
      </div>
    </React.Fragment>
  )
}

export default Ventures

import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Modal,
  ModalHeader,
} from "reactstrap"
import { useHistory } from "react-router-dom"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import ReactPaginate from "react-paginate"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import gig from "../../assets/images/what.gif"

function Ventures() {
  const [Actin, setActin] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const history = useHistory()

  const [form1, setform1] = useState([])

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
        URLS.GetAllPromoterReRequest,
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

  const Search = e => {
    const myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)

    const token = datas
    console.log(token)

    axios
      .post(
        URLS.GetAllPromoterReRequestSearch + `${e.target.value}`,
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

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const Actinid1 = data => {
    sessionStorage.setItem("promoterid", data._id)
    history.push("/ViewPromoter")
  }

  const [modal_small2, setmodal_small2] = useState(false)

  const [form, setform] = useState([])

  function tog_small2(data) {
    setmodal_small2(!modal_small2)
    setform(data)
  }

  const Approved = () => {
    var token = datas
    var remid = { promoterId: form._id }

    axios
      .post(URLS.UpdatePromoterReRequest, remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small2(false)
            GetPromoters()
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
            breadcrumbItem="Employee Re-Verification list"
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
                              <th>Employee Image</th>
                              <th>Employee Store Name</th>
                              <th>Employee Name</th>
                              <th>Employee Number</th>
                              <th>Employee Email</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lists.map((data, key) => (
                              <tr key={key} className="text-center">
                                <td>{(pageNumber - 1) * 5 + key + 6}</td>
                                <td>
                                  <img
                                    src={URLS.Base + data.profilePic}
                                    alt=""
                                    className=" rounded-circle"
                                    style={{ height: "50px", width: "50px" }}
                                  />
                                </td>
                                <td>{data.storeName}</td>
                                <td>{data.name}</td>
                                <td>{data.phone}</td>
                                <td>{data.email}</td>

                                <td>
                                  {data.kycReverificationStatus ==
                                  "requested" ? (
                                    <>
                                      <span className="badge bg-warning">
                                        {data.kycReverificationStatus}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="badge bg-success">
                                        {data.kycReverificationStatus}
                                      </span>
                                    </>
                                  )}
                                </td>

                                <td>
                                  <Button
                                    onClick={() => {
                                      Actinid1(data)
                                    }}
                                    size="sm"
                                    className="m-1"
                                    outline
                                    color="info"
                                  >
                                    <i
                                      style={{ fontSize: " 14px" }}
                                      className="fas fa-eye"
                                    ></i>
                                  </Button>
                                  {data.kycReverificationStatus ==
                                  "requested" ? (
                                    <>
                                      <Button
                                        onClick={() => {
                                          tog_small2(data)
                                        }}
                                        size="sm"
                                        className="m-1"
                                        outline
                                        color="success"
                                      >
                                        <i
                                          style={{ fontSize: " 14px" }}
                                          className="fas fa-user-check"
                                        ></i>
                                      </Button>
                                    </>
                                  ) : (
                                    <></>
                                  )}
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

          <Modal
            size="md"
            isOpen={modal_small2}
            toggle={() => {
              tog_small2()
            }}
            centered
          >
            <ModalHeader className="border-bottom-0">
              <button
                onClick={() => {
                  setmodal_small2(false)
                }}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </ModalHeader>
            <div className="modal-body">
              <div className="text-center mb-4">
                <div className="avatar-md mx-auto mb-4">
                  <div className="avatar-title bg-light  rounded-circle text-primary h1">
                    <i className="mdi mdi-email-open text-success"></i>
                  </div>
                </div>

                <div className="row justify-content-center">
                  <div className="col-xl-10">
                    <h4 className="text-success mb-3">
                      Request Approve Kyc Re-Verification !
                    </h4>
                    <p className="text-muted font-size-14 mb-3">
                      The User Can Re-Verify Kyc Details.
                    </p>

                    <p className="text-muted font-size-14 mb-2">
                      Employee Name :
                      <span className="text-info">{form.name}</span>
                    </p>
                    <p className="text-muted font-size-14 mb-4">
                      Employee Email :
                      <span className="text-info">{form.email}</span>
                    </p>
                  </div>
                </div>
              </div>
              <hr></hr>
              <div style={{ float: "right" }}>
                <Button
                  onClick={() => {
                    setmodal_small2(false)
                  }}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>

                <Button
                  color="success"
                  type="button"
                  id="button-addon2"
                  className="m-1"
                  onClick={() => {
                    Approved()
                  }}
                >
                  Approved
                </Button>
              </div>
            </div>
          </Modal>
          <ToastContainer />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Ventures

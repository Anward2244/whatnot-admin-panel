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
  Form,
  ModalHeader,
  Label,
} from "reactstrap"
import { useHistory } from "react-router-dom"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import ReactPaginate from "react-paginate"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import gig from "../../assets/images/what.gif"
import mark from "../../assets/images/mark2.gif"
import Trash from "../../assets/images/trash.gif"

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
        URLS.GetAllPromoters,
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

    axios
      .post(
        URLS.GetPromotersearch + `${e.target.value}`,
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

  function tog_small2() {
    setmodal_small2(!modal_small2)
  }

  const getpopup = data => {
    setform(data)
    tog_small2()
  }

  const Approved = () => {
    var token = datas
    var remid = { promoterId: form._id }

    axios
      .post(URLS.UpdateKyc, remid, {
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

  const [modal_small1, setmodal_small1] = useState(false)

  const [form2, setform2] = useState([])

  const [form5, setform5] = useState([])

  const handleChange1 = e => {
    const myUser = { ...form2 }
    myUser[e.target.name] = e.target.value
    setform2(myUser)
  }

  function tog_small1(data) {
    setmodal_small1(!modal_small1)
    setform5(data)
  }

  const handleSubmit = e => {
    e.preventDefault()
    Reject()
  }

  const Reject = () => {
    var token = datas
    var remid = { promoterId: form5._id, reason: form2.reason }

    axios
      .post(URLS.RejectKyc, remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small1(false)
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

  const [modal_small3, setmodal_small3] = useState(false)

  const [form3, setform3] = useState([])

  const [form4, setform4] = useState([])

  const handleChange3 = e => {
    const myUser = { ...form3 }
    myUser[e.target.name] = e.target.value
    setform3(myUser)
  }

  function tog_small3(data) {
    setmodal_small3(!modal_small3)
    setform4(data)
  }

  const handleSubmit3 = e => {
    e.preventDefault()
    ChangePassword()
  }

  const ChangePassword = () => {
    var token = datas
    var remid = {
      promoterId: form4._id,
      newpassword: form3.newpassword,
      confirmpassword: form3.confirmPassword,
    }

    axios
      .post(URLS.PromotersChangepassword, remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small3(false)
            setform3({
              newpassword: "",
              confirmPassword: "",
            })
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
          <Breadcrumbs title="Whatnot" breadcrumbItem="Employee list" />

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
                              <th>Reject Reason</th>
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
                                  {data.kyc == "not uploaded" ? (
                                    <span className="badge bg-dark">
                                      Kyc Not Updated
                                    </span>
                                  ) : (
                                    <>
                                      {data.kycStatus == "approved" ? (
                                        <>
                                          <span className="badge bg-success ">
                                            {data.kycStatus}
                                          </span>
                                        </>
                                      ) : (
                                        <></>
                                      )}

                                      {data.kycStatus == "pending" ? (
                                        <>
                                          <span className="badge bg-warning ">
                                            {data.kycStatus}
                                          </span>
                                        </>
                                      ) : (
                                        ""
                                      )}

                                      {data.kycStatus == "rejected" ? (
                                        <>
                                          <span className="badge bg-danger ">
                                            {data.kycStatus}
                                          </span>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  )}
                                </td>
                                <td>
                                  {data.kycStatus == "rejected" ? (
                                    <>{data.rejectionReason}</>
                                  ) : (
                                    "-"
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

                                  {data.kyc == "not uploaded" ? (
                                    ""
                                  ) : (
                                    <>
                                      {data.kycStatus == "pending"
                                       ? (
                                        <Button
                                          onClick={() => {
                                            getpopup(data)
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
                                      ) : (
                                        <></>
                                      )}

                                      {data.kycStatus == "pending"  ? (
                                        <Button
                                          onClick={() => {
                                            tog_small1(data)
                                          }}
                                          size="sm"
                                          className="m-1"
                                          outline
                                          color="danger"
                                        >
                                          <i
                                            style={{ fontSize: " 14px" }}
                                            className="bx bxs-user-x"
                                          ></i>
                                        </Button>
                                      ) : (
                                        <></>
                                      )}

                                      {data.kycStatus == "approved" ? (
                                        <>
                                          <Button
                                            onClick={() => {
                                              tog_small3(data)
                                            }}
                                            size="sm"
                                            className="m-1"
                                            outline
                                            color="warning"
                                          >
                                            <i
                                              style={{ fontSize: " 14px" }}
                                              className="bx bxs-lock-open"
                                            ></i>
                                          </Button>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </>
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
              {" "}
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
                      Approve Kyc Verification !
                    </h4>
                    <p className="text-muted font-size-14 mb-3">
                      The user has been verified, and a confirmation email
                      containing the password has been sent.
                    </p>

                    <p className="text-muted font-size-14 mb-2">
                      Employee Name :{" "}
                      <span className="text-info">{form.name}</span>
                    </p>
                    <p className="text-muted font-size-14 mb-4">
                      Employee Email :{" "}
                      <span className="text-info">{form.email}</span>
                    </p>

                    <div className="input-group rounded bg-light">
                      <Col md={12}>
                        <img src={mark} width="100%"></img>
                      </Col>
                    </div>
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
                  <i className="bx bxs-paper-plane"></i> Password Sent To Mail
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            size="md"
            isOpen={modal_small1}
            toggle={() => {
              tog_small1()
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="mySmallModalLabel">
                Reject kYC
              </h5>
              <button
                onClick={() => {
                  setmodal_small1(false)
                }}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                onSubmit={e => {
                  handleSubmit(e)
                }}
              >
                <Col md={12}>
                  <img src={Trash} width="100%"></img>
                </Col>

                <Col md={12}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Reason <span className="text-danger">*</span>
                    </Label>
                    <textarea
                      type="text"
                      rows="3"
                      className="form-control "
                      id="basicpill-firstname-input1"
                      placeholder="Enter Reason"
                      required
                      value={form2.reason}
                      name="reason"
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>

                <div style={{ float: "right" }}>
                  <Button
                    onClick={() => {
                      setmodal_small1(false)
                    }}
                    color="danger"
                    type="button"
                  >
                    Cancel <i className="fas fa-times-circle"></i>
                  </Button>
                  <Button className="m-1" color="primary" type="submit">
                    Submit <i className="fas fa-check-circle"></i>
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>

          <Modal
            size="md"
            isOpen={modal_small3}
            toggle={() => {
              tog_small3()
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="mySmallModalLabel">
                Change Password
              </h5>
              <button
                onClick={() => {
                  setmodal_small3(false)
                }}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                onSubmit={e => {
                  handleSubmit3(e)
                }}
              >
                <div className="row justify-content-center">
                  <div className="col-md-10">
                    <div className="mb-2">
                      <Label for="basicpill-firstname-input1">
                        New Password<span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter New Password"
                        required
                        value={form3.newpassword}
                        name="newpassword"
                        onChange={e => {
                          handleChange3(e)
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <Label for="basicpill-firstname-input1">
                        Confirm Password
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Confirm Password"
                        required
                        value={form3.confirmPassword}
                        name="confirmPassword"
                        onChange={e => {
                          handleChange3(e)
                        }}
                      />
                    </div>

                    <p className="text-info font-size-14 mb-3 text-center ">
                      The password change confirmation has been sent to the
                      user's email.
                    </p>

                    <div className="input-group rounded bg-light">
                      <Col md={12}>
                        <img src={mark} width="100%"></img>
                      </Col>
                    </div>
                  </div>
                </div>
                <hr></hr>
                <div style={{ float: "right" }}>
                  <Button
                    onClick={() => {
                      setmodal_small3(false)
                    }}
                    color="danger"
                    type="button"
                  >
                    Cancel <i className="fas fa-times-circle"></i>
                  </Button>
                  <Button className="m-1" color="primary" type="submit">
                    Sent <i className="fas fa-check-circle"></i>
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>

          <ToastContainer />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Ventures

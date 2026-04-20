import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Label,
  Modal,
  Form,
  Input,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import ReactPaginate from "react-paginate"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import gig from "../../assets/images/what.gif"
import mark from "../../assets/images/mark1.gif"
import Trash from "../../assets/images/trash.gif"

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
        URLS.GetAllPromotersWallet,
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

  const [modal_small2, setmodal_small2] = useState(false)

  const [form, setform] = useState([])

  const [forms, setforms] = useState([])

  const handleChange = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  function tog_small2(data) {
    setmodal_small2(!modal_small2)
    setforms(data)
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    Approved()
  }

  const Approved = () => {
    var token = datas
    var remid = { walletRequestId: forms._id, transactionId: form.transactionId }

    axios
      .post(URLS.ApprovedWallet, remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small2(false)
            GetAtps()
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

  const [form3, setform3] = useState([])

  const handleChange1 = e => {
    const myUser = { ...form2 }
    myUser[e.target.name] = e.target.value
    setform2(myUser)
  }

  function tog_small1(data) {
    setmodal_small1(!modal_small1)
    setform3(data)
  }

  const handleSubmit = e => {
    e.preventDefault()
    Reject()
  }

  const Reject = () => {
    var token = datas
    var remid = { walletRequestId: form3._id, reason: form2.reason }

    axios
      .post(URLS.RejectWallet, remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small1(false)
            GetAtps()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const [form1, setform1] = useState([])
  const Search = e => {
    const myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)

    const token = datas
    console.log(token)

    axios
      .post(
        URLS.GetAllPromotersWalletSearch + `${e.target.value}`,
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
            breadcrumbItem="Employee Pending Wallet Request"
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
                              <th>Status</th>
                              <th>Action</th>
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
                                    className=" rounded-circle"
                                    style={{ height: "50px", width: "50px" }}
                                  />
                                </td>
                                <td>{data.promoterName}</td>
                                <td>{data.promoterMobile}</td>
                                <td>{data.promoterEmail}</td>
                                <td>{data.amount}</td>
                                <td>
                                  <span className="badge bg-danger ">
                                    {data.status}
                                  </span>
                                </td>
                                <td>
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
                                      className="bx bxs-x-square"
                                    ></i>
                                  </Button>
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
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="mySmallModalLabel">
                Approved
              </h5>
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
            </div>
            <div className="modal-body">
              <Form
                onSubmit={e => {
                  handleSubmit1(e)
                }}
              >
                <Col md={12}>
                  <img src={mark} width="100%"></img>
                </Col>

                <Col md={12}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Transaction Id <span className="text-danger">*</span>
                    </Label>
                    <textarea
                      type="text"
                      rows="2"
                      className="form-control "
                      id="basicpill-firstname-input1"
                      placeholder="Enter Transaction Id "
                      required
                      value={form.transactionId}
                      name="transactionId"
                      onChange={e => {
                        handleChange(e)
                      }}
                    />
                  </div>
                </Col>

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
                  <Button className="m-1" color="primary" type="submit">
                    Submit <i className="fas fa-check-circle"></i>
                  </Button>
                </div>
              </Form>
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
                Reject
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
          <ToastContainer />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Ventures

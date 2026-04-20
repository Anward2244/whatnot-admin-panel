import React, { useState, useEffect } from "react"
import {
  CardBody,
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Modal,
  Label,
  Form,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import classnames from "classnames"
import ReactPaginate from "react-paginate"
import { useHistory } from "react-router-dom"
import axios from "axios"
import { URLS } from "../../Url"
import gig from "../../assets/images/what.gif"
import mark from "../../assets/images/target.gif"
import mark1 from "../../assets/images/mark1.gif"
import { saveAs } from "file-saver"
import Trash from "../../assets/images/trash.gif"

function State() {
  const [isLoading, setIsLoading] = useState(false)

  const [activeTab1, setactiveTab1] = useState("5")

  const toggle1 = tab => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab)
    }
  }

  const history = useHistory()

  const [forms, setforms] = useState([])

  const [book, setbook] = useState([])

  const [book1, setbook1] = useState([])

  const [book2, setbook2] = useState([])

  const [target, settarget] = useState([])

  const [targets, settargets] = useState([])

  useEffect(() => {
    GetOnePromoter()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const Actinid = sessionStorage.getItem("promoterid")

  const GetOnePromoter = () => {
    const data = {
      promoter_id: Actinid,
    }

    var token = datas
    axios
      .post(URLS.GetOnePromoters, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setforms(res.data.promoter[0])
        setbook(res.data.sales)
        settargets(res.data)
        setbook1(res.data.pendingSales)
        setbook2(res.data.rejectedSales)
        settarget(res.data.targetachieved)
        setIsLoading(false)
      })
  }

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = book.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(book.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const [listPerPage1] = useState(5)
  const [pageNumber1, setPageNumber1] = useState(0)

  const pagesVisited1 = pageNumber1 * listPerPage1
  const lists1 = book1.slice(pagesVisited1, pagesVisited1 + listPerPage1)
  const pageCount1 = Math.ceil(book1.length / listPerPage1)
  const changePage1 = ({ selected }) => {
    setPageNumber1(selected)
  }

  
  const [listPerPage2] = useState(5)
  const [pageNumber2, setPageNumber2] = useState(0)

  const pagesVisited2 = pageNumber2 * listPerPage2
  const lists2 = book2.slice(pagesVisited2, pagesVisited2 + listPerPage2)
  const pageCount2 = Math.ceil(book2.length / listPerPage2)
  const changePage2 = ({ selected }) => {
    setPageNumber2(selected)
  }

  
  const video = URLS.Base + forms.kyc

  const [modal_small2, setmodal_small2] = useState(false)

  const handleChange = e => {
    const myUser = { ...targets }
    myUser[e.target.name] = e.target.value
    settargets(myUser)
  }

  function tog_small2() {
    setmodal_small2(!modal_small2)
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    Approved()
  }

  const Approved = () => {
    var token = datas
    var remid = {
      promoterId: forms._id,
      monthTarget: targets.monthTarget,
      bonus: targets.bonus,
    }

    axios
      .post(URLS.TargetsChanges, remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small2(false)
            GetOnePromoter()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const downloadImage = data => {
    saveAs(URLS.Base + data.invoicePath)
  }

  const [modal_small1, setmodal_small1] = useState(false)

  const [form1, setform1] = useState([])

  function tog_small1(data) {
    setmodal_small1(!modal_small1)
    setform1(data)
  }

  const Approved1 = () => {
    var token = datas
    var remid = { promoterId: form1.productId, saleId: form1._id }

    axios
      .post(URLS.ApprovedSales, remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small1(false)
            GetOnePromoter()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const [modal_small12, setmodal_small12] = useState(false)

  const [form2, setform2] = useState([])

  const [form3, setform3] = useState([])

  const handleChange1 = e => {
    const myUser = { ...form2 }
    myUser[e.target.name] = e.target.value
    setform2(myUser)
  }

  function tog_small12(data) {
    setmodal_small12(!modal_small12)
    setform3(data)
  }

  const handleSubmit = e => {
    e.preventDefault()
    Reject()
  }

  const Reject = () => {
    var token = datas
    var remid = {
      reason: form2.reason,
      promoterId: form3.promoterId,
      saleId: form3._id,
    }

    axios
      .post(URLS.RejectSales, remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small12(false)
            GetOnePromoter()
            setform2({
              reason: "",
            })
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
        <Container fluid>
          <Breadcrumbs title="Whatnot" breadcrumbItem="Employee Profile" />
          <Row>
            <Col>
              <Button
                onClick={() => history.goBack()}
                className="mb-3  m-1 "
                style={{ float: "right" }}
                color="primary"
              >
                <i className="far fa-arrow-alt-circle-left"></i> Back
              </Button>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col md={12}>
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
                      <Nav pills className="navtab-bg nav-justified">
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab1 === "5",
                            })}
                            onClick={() => {
                              toggle1("5")
                            }}
                          >
                            Profile
                          </NavLink>
                        </NavItem>

                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab1 === "7",
                            })}
                            onClick={() => {
                              toggle1("7")
                            }}
                          >
                            Video Kyc
                          </NavLink>
                        </NavItem>

                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab1 === "9",
                            })}
                            onClick={() => {
                              toggle1("9")
                            }}
                          >
                            Target / Achieved
                          </NavLink>
                        </NavItem>

                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab1 === "6",
                            })}
                            onClick={() => {
                              toggle1("6")
                            }}
                          >
                            Pending Sales :
                            <span className="text-warning">{lists1.length}</span>
                          </NavLink>
                        </NavItem>

                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab1 === "8",
                            })}
                            onClick={() => {
                              toggle1("8")
                            }}
                          >
                            Completed Sales :
                            <span className="text-success">{lists.length}</span>
                          </NavLink>
                        </NavItem>

                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab1 === "10",
                            })}
                            onClick={() => {
                              toggle1("10")
                            }}
                          >
                            Reject Sales :
                            <span className="text-danger">{lists2.length}</span>
                          </NavLink>
                        </NavItem>
                      </Nav>

                      <TabContent
                        activeTab={activeTab1}
                        className="p-4  text-muted"
                      >
                        <TabPane tabId="5">
                          <h5 className="mb-3">Profile Details : </h5>
                          <Row>
                            <Col lg={4}>
                              <ul className="list-unstyled vstack gap-3 mb-0 mt-2">
                                <img
                                  src={URLS.Base + forms.profilePic}
                                  height="150px"
                                  width="150px"
                                  alt=""
                                  className="rounded-circle"
                                ></img>

                                <li className="mt-4">
                                  <div className="d-flex ">
                                    <i className="bx bxs-buildings font-size-18 text-primary"></i>
                                    <div className="ms-3">
                                      <h6 className="mb-1 fw-semibold">
                                        Name:
                                      </h6>
                                      <span className="text-muted">
                                        {forms.name}
                                      </span>
                                    </div>
                                  </div>
                                </li>

                                <li>
                                  <div className="d-flex mt-3">
                                    <i className="bx bx-user font-size-18 text-primary"></i>
                                    <div className="ms-3">
                                      <h6 className="mb-1 fw-semibold">
                                        Gender:
                                      </h6>
                                      <span className="text-muted">
                                        {forms.gender}
                                      </span>
                                    </div>
                                  </div>
                                </li>

                                <li>
                                  <div className="d-flex mt-3">
                                    <i className="bx bx-bar-chart-square font-size-18 text-primary"></i>
                                    <div className="ms-3">
                                      <h6 className="mb-1 fw-semibold">Age:</h6>
                                      <span className="text-muted">
                                        {forms.age}
                                      </span>
                                    </div>
                                  </div>
                                </li>

                                <li>
                                  <div className="d-flex  mt-3">
                                    <i className="bx bx-phone font-size-18 text-primary"></i>
                                    <div className="ms-3">
                                      <h6 className="mb-1 fw-semibold">
                                        Contact Number:
                                      </h6>
                                      {forms.phone}
                                    </div>
                                  </div>
                                </li>

                                <li>
                                  <div className="d-flex  mt-3">
                                    <i className="bx bx-message font-size-18 text-primary"></i>
                                    <div className="ms-3">
                                      <h6 className="mb-1 fw-semibold">
                                        Email:
                                      </h6>
                                      {forms.email}
                                    </div>
                                  </div>
                                </li>

                                <li>
                                  <div className="d-flex  mt-3">
                                    <i className="bx bx-bookmark font-size-18 text-primary"></i>
                                    <div className="ms-3">
                                      <h6 className="mb-1 fw-semibold">
                                        Status :
                                      </h6>
                                      <span className="text-muted">
                                        {forms.kycVerified == true ? (
                                          <>kYC Verified</>
                                        ) : (
                                          <>kYC Not Verified</>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </Col>

                            <Col lg={8}>
                              <Row>
                                <Col>
                                  <ul className="verti-timeline list-unstyled">
                                    <li className="event-list  mt-2">
                                      <div className="event-timeline-dot">
                                        <i className="bx bx-right-arrow-circle"></i>
                                      </div>
                                      <div className="d-flex">
                                        <div className="flex-grow-1">
                                          <div>
                                            <h6 className="font-size-14 ">
                                              Bank Name
                                            </h6>
                                            <p className="text-muted">
                                              {forms.bankName}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>

                                    <li className="event-list">
                                      <div className="event-timeline-dot">
                                        <i className="bx bx-right-arrow-circle"></i>
                                      </div>
                                      <div className="d-flex">
                                        <div className="flex-grow-1">
                                          <div>
                                            <h6 className="font-size-14 ">
                                              Account Holder Name
                                            </h6>
                                            <p className="text-muted">
                                              {forms.accountHolderName}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>

                                    <li className="event-list">
                                      <div className="event-timeline-dot">
                                        <i className="bx bx-right-arrow-circle"></i>
                                      </div>
                                      <div className="d-flex">
                                        <div className="flex-grow-1">
                                          <div>
                                            <h6 className="font-size-14 ">
                                              Account Number
                                            </h6>
                                            <p className="text-muted">
                                              {forms.accountNumber}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>

                                    <li className="event-list">
                                      <div className="event-timeline-dot">
                                        <i className="bx bx-right-arrow-circle"></i>
                                      </div>
                                      <div className="d-flex">
                                        <div className="flex-grow-1">
                                          <div>
                                            <h6 className="font-size-14 ">
                                              Branch
                                            </h6>
                                            <p className="text-muted">
                                              {forms.branchName}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>

                                    <li className="event-list">
                                      <div className="event-timeline-dot">
                                        <i className="bx bx-right-arrow-circle"></i>
                                      </div>
                                      <div className="d-flex">
                                        <div className="flex-grow-1">
                                          <div>
                                            <h6 className="font-size-14 ">
                                              IFSC code
                                            </h6>
                                            <p className="text-muted">
                                              {forms.IFSC}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>

                                    <li className="event-list">
                                      <div className="event-timeline-dot">
                                        <i className="bx bx-right-arrow-circle"></i>
                                      </div>
                                      <div className="d-flex">
                                        <div className="flex-grow-1">
                                          <div>
                                            <h6 className="font-size-14 mb-1">
                                              Monthly Target
                                            </h6>
                                            <p className="text-muted">
                                              {targets.monthTarget}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>

                                    <li className="event-list">
                                      <div className="event-timeline-dot">
                                        <i className="bx bx-right-arrow-circle"></i>
                                      </div>
                                      <div className="d-flex">
                                        <div className="flex-grow-1">
                                          <div>
                                            <h6 className="font-size-14 mb-1">
                                              Wallet
                                            </h6>
                                            <p className="text-muted">
                                              {forms.wallet}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="7">
                          <h5 className="mb-3">Video Kyc: </h5>
                          <Row className="d-flex justify-content-center">
                            <Col md={8}>
                              <iframe
                                src={video}
                                width="90%"
                                height="400px"
                                frameBorder="0"
                                allow="encrypted-media"
                                allowFullScreen
                              ></iframe>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="9">
                          <Row>
                            <Col md={6}>
                              <h5 className="mb-3">Target / Achieved: </h5>
                            </Col>
                            <Col md={6}>
                              <Button
                                onClick={() => {
                                  tog_small2(data)
                                }}
                                size="md"
                                className="m-1"
                                color="success"
                                style={{ float: "right" }}
                              >
                                Target / Bonus Edit
                              </Button>
                            </Col>
                          </Row>
                          <div className="table-rep-plugin mt-4 table-responsive">
                            <Table hover className="table table-bordered mb-4 ">
                              <thead>
                                <tr className="text-center">
                                  <th>S.No</th>
                                  <th>Month </th>
                                  <th>Target</th>
                                  <th>Bonus</th>
                                  <th>Achieved</th>
                                </tr>
                              </thead>
                              <tbody>
                                {target.map((data, key) => (
                                  <tr key={key} className="text-center">
                                    <td>{key + 1}</td>
                                    <td>{data.month}</td>
                                    <td>{data.monthTarget}</td>
                                    <td>{data.bonus}</td>
                                    <td>{data.sale}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </TabPane>
                        <TabPane tabId="6">
                          <h5 className="mb-3">Pending Sales List: </h5>
                          <div className="table-rep-plugin mt-4 table-responsive">
                            <Table hover className="table table-bordered mb-4 ">
                              <thead>
                                <tr className="text-center">
                                  <th>S.No</th>
                                  <th>Brand Name</th>
                                  <th>Category Name</th>
                                  <th>Product Name</th>
                                  <th>Quantity</th>
                                  <th>Serial Number</th>
                                  <th>Price</th>
                                  <th>Selling Price</th>
                                  <th>incentive</th>
                                  <th>Invoice</th>
                                  <th>Price Miss Match</th>
                                  <th>Status</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lists1.map((data, key) => (
                                  <tr key={key} className="text-center">
                                    <td>{key + 1}</td>
                                    <td>{data.brandName}</td>
                                    <td>{data.categoryName}</td>
                                    <td>{data.productName}</td>
                                    <td>{data.quantity}</td>
                                    <td>{data.serialNumber}</td>
                                    <td>{data.price}</td>
                                    <td>{data.sellingPrice}</td>
                                    <td>{data.incentive}</td>
                                    <td>
                                      <Button
                                        outline
                                        onClick={() => {
                                          downloadImage(data)
                                        }}
                                        className="mb-1 m-1 "
                                        style={{ float: "right" }}
                                        color="danger"
                                      >
                                        <i
                                          className="fas fa-cloud-download-alt"
                                          aria-hidden="true"
                                        ></i>
                                      </Button>
                                    </td>
                                    <td>
                                      <a
                                        href={
                                          URLS.Base +
                                          data.priceMatchScreenshotPath
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img
                                          src={
                                            URLS.Base +
                                            data.priceMatchScreenshotPath
                                          }
                                          height="100px"
                                        ></img>
                                      </a>
                                    </td>

                                    <td>
                                      <span className="badge bg-warning">
                                        {data.status}
                                      </span>
                                    </td>
                                    <td>
                                      {data.status == "approved" ||
                                      data.status == "rejected" ? (
                                        "-"
                                      ) : (
                                        <Button
                                          onClick={() => {
                                            tog_small1(data)
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
                                      )}
                                      {data.status == "approved" ||
                                      data.status == "rejected" ? (
                                        ""
                                      ) : (
                                        <Button
                                          onClick={() => {
                                            tog_small12(data)
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
                                pageCount={pageCount1}
                                onPageChange={changePage1}
                                containerClassName={"pagination"}
                                previousLinkClassName={"previousBttn"}
                                nextLinkClassName={"nextBttn"}
                                disabledClassName={"disabled"}
                                activeClassName={"active"}
                                total={lists1.length}
                              />
                            </div>
                          </div>
                        </TabPane>
                        <TabPane tabId="8">
                          <h5 className="mb-3">Completed Sales List: </h5>
                          <div className="table-rep-plugin mt-4 table-responsive">
                            <Table hover className="table table-bordered mb-4 ">
                              <thead>
                                <tr className="text-center">
                                  <th>S.No</th>
                                  <th>Brand Name</th>
                                  <th>Category Name</th>
                                  <th>Product Name</th>
                                  <th>Quantity</th>
                                  <th>Serial Number</th>
                                  <th>Price</th>
                                  <th>Selling Price</th>
                                  <th>incentive</th>
                                  <th>Invoice</th>
                                  <th>Price Miss Match</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lists.map((data, key) => (
                                  <tr key={key} className="text-center">
                                    <td>{key + 1}</td>
                                    <td>{data.brandName}</td>
                                    <td>{data.categoryName}</td>
                                    <td>{data.productName}</td>
                                    <td>{data.quantity}</td>
                                    <td>{data.serialNumber}</td>
                                    <td>{data.price}</td>
                                    <td>{data.sellingPrice}</td>
                                    <td>{data.incentive}</td>
                                    <td>
                                      <Button
                                        outline
                                        onClick={() => {
                                          downloadImage(data)
                                        }}
                                        className="mb-1 m-1 "
                                        style={{ float: "right" }}
                                        color="danger"
                                      >
                                        <i
                                          className="fas fa-cloud-download-alt"
                                          aria-hidden="true"
                                        ></i>
                                      </Button>
                                    </td>
                                    <td>
                                      <a
                                        href={
                                          URLS.Base +
                                          data.priceMatchScreenshotPath
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img
                                          src={
                                            URLS.Base +
                                            data.priceMatchScreenshotPath
                                          }
                                          height="100px"
                                        ></img>
                                      </a>
                                    </td>
                                    <td>
                                      <span className="badge bg-success">
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
                        </TabPane>
                        <TabPane tabId="10">
                          <h5 className="mb-3">Reject Sales List: </h5>
                          <div className="table-rep-plugin mt-4 table-responsive">
                            <Table hover className="table table-bordered mb-4 ">
                              <thead>
                                <tr className="text-center">
                                  <th>S.No</th>
                                  <th>Brand Name</th>
                                  <th>Category Name</th>
                                  <th>Product Name</th>
                                  <th>Quantity</th>
                                  <th>Serial Number</th>
                                  <th>Price</th>
                                  <th>Selling Price</th>
                                  <th>incentive</th>
                                  <th>Invoice</th>
                                  <th>Price Miss Match</th>
                                  <th>Reject Reason</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lists2.map((data, key) => (
                                  <tr key={key} className="text-center">
                                    <td>{key + 1}</td>
                                    <td>{data.brandName}</td>
                                    <td>{data.categoryName}</td>
                                    <td>{data.productName}</td>
                                    <td>{data.quantity}</td>
                                    <td>{data.serialNumber}</td>
                                    <td>{data.price}</td>
                                    <td>{data.sellingPrice}</td>
                                    <td>{data.incentive}</td>
                                    <td>
                                      <Button
                                        outline
                                        onClick={() => {
                                          downloadImage(data)
                                        }}
                                        className="mb-1 m-1 "
                                        style={{ float: "right" }}
                                        color="danger"
                                      >
                                        <i
                                          className="fas fa-cloud-download-alt"
                                          aria-hidden="true"
                                        ></i>
                                      </Button>
                                    </td>
                                    <td>
                                      <a
                                        href={
                                          URLS.Base +
                                          data.priceMatchScreenshotPath
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img
                                          src={
                                            URLS.Base +
                                            data.priceMatchScreenshotPath
                                          }
                                          height="100px"
                                        ></img>
                                      </a>
                                    </td>
                                    <td>{data.reason == "" ? <>-</>:<>{data.reason}</>}</td>
                                    <td>
                                      <span className="badge bg-danger">
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
                                pageCount={pageCount2}
                                onPageChange={changePage2}
                                containerClassName={"pagination"}
                                previousLinkClassName={"previousBttn"}
                                nextLinkClassName={"nextBttn"}
                                disabledClassName={"disabled"}
                                activeClassName={"active"}
                                total={lists2.length}
                              />
                            </div>
                          </div>
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal
          size="md"
          isOpen={modal_small1}
          toggle={() => {
            tog_small1()
          }}
          centered
        >
          {" "}
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Approved
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
            <Col md={12}>
              <img src={mark1} width="100%"></img>
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
              <Button
                className="m-1"
                color="primary"
                onClick={() => {
                  Approved1()
                }}
              >
                Submit <i className="fas fa-check-circle"></i>
              </Button>
            </div>
          </div>
        </Modal>
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
              Edit Target / Bonus
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
                <img src={mark} width="100%" height="350px"></img>
              </Col>
              <Col md={12}>
                <div className="mb-3">
                  <Label for="basicpill-firstname-input1">
                    Bonus <span className="text-danger">*</span>
                  </Label>
                  <input
                    type="text"
                    className="form-control "
                    id="basicpill-firstname-input1"
                    placeholder="Enter Bonus"
                    required
                    value={targets.bonus}
                    name="bonus"
                    onChange={e => {
                      handleChange(e)
                    }}
                  />
                </div>
              </Col>
              <Col md={12}>
                <div className="mb-3">
                  <Label for="basicpill-firstname-input1">
                    Target <span className="text-danger">*</span>
                  </Label>
                  <input
                    type="text"
                    className="form-control "
                    id="basicpill-firstname-input1"
                    placeholder="Enter Target"
                    required
                    value={targets.monthTarget}
                    name="monthTarget"
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
          isOpen={modal_small12}
          toggle={() => {
            tog_small12()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Reject
            </h5>
            <button
              onClick={() => {
                setmodal_small12(false)
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
                    setmodal_small12(false)
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
    </React.Fragment>
  )
}

export default State

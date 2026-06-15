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

  const [kycData, setKycData] = useState(null)

  const [book, setbook] = useState([])

  const [book1, setbook1] = useState([])

  const [book2, setbook2] = useState([])

  const [target, settarget] = useState([])

  const [targets, settargets] = useState([])

  useEffect(() => {
    GetOnePromoter()
    getKycDetails()
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
  // console.log(forms)
  const getKycDetails = () => {
    const data = {
      promoterId: Actinid,
    }

    var token = datas
    axios
      .post(URLS.GetKycByPromoterId, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.data && res.data.data) {
          setKycData(res.data.data)
        }
      })
      .catch(err => {
        console.error("Failed to fetch KYC details", err)
        setKycData(null)
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

  const [modal_small2, setmodal_small2] = useState(false)
  const [modal_kyc, setmodal_kyc] = useState(false)
  const [aadhaarFile, setAadhaarFile] = useState(null)
  const [panFile, setPanFile] = useState(null)
  const [driveUrl, setDriveUrl] = useState("")

  const handleChange = e => {
    const myUser = { ...targets }
    myUser[e.target.name] = e.target.value
    settargets(myUser)
  }

  function tog_small2() {
    setmodal_small2(!modal_small2)
  }

  const toggleKycModal = () => {
    setmodal_kyc(!modal_kyc)
  }

  const handleAadhaarChange = e => {
    setAadhaarFile(e.target.files[0])
  }

  const handlePanChange = e => {
    setPanFile(e.target.files[0])
  }

  const handleKycUpload = e => {
    e.preventDefault()
    if (!aadhaarFile && !panFile && !driveUrl) {
      toast("Please select at least one image or provide a Drive link.")
      return
    }

    const token = datas
    const formData = new FormData()
    formData.append("promoterId", forms._id)
    if (aadhaarFile) {
      formData.append("aadhaarImage", aadhaarFile)
    }
    if (panFile) {
      formData.append("panImage", panFile)
    }
    if (driveUrl) {
      formData.append("driveUrl", driveUrl)
    }

    axios
      .post(URLS.AdminUploadKycImages, formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
        },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_kyc(false)
            setAadhaarFile(null)
            setPanFile(null)
            setDriveUrl("")
            getKycDetails()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          } else {
            toast("Failed to upload KYC images.")
          }
        }
      )
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

  // console.log(kycData)
  
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
              <Card className="shadow-sm">
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
                            KYC
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
                          <Row>
                            <Col md={12}>
                              <div className="d-flex align-items-center mb-4">
                                <img
                                  src={URLS.Base + forms.profilePic}
                                  alt="Profile"
                                  className="rounded-circle avatar-xl img-thumbnail"
                                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                />
                                <div className="ms-4">
                                  <h4 className="mb-1">{forms.name}</h4>
                                  <p className="text-muted mb-1">{forms.email} | {forms.phone}</p>
                                  <div>
                                    {forms.kycVerified ? (
                                      <span className="badge bg-success font-size-12">KYC Verified</span>
                                    ) : (
                                      <span className="badge bg-danger font-size-12">KYC Not Verified</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col lg={6}>
                              <Card className="border shadow-none mb-4">
                                <CardBody>
                                  <h5 className="font-size-15 mb-3 border-bottom pb-2">Personal Information</h5>
                                  <div className="table-responsive">
                                    <Table className="table-nowrap mb-0">
                                      <tbody>
                                        <tr>
                                          <th scope="row" style={{ width: "40%" }}>Gender :</th>
                                          <td>{forms.gender || "-"}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Age :</th>
                                          <td>{forms.age || "-"}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">KYC Uploaded Date :</th>
                                          <td>{forms.kycUploadedDate ? new Date(forms.kycUploadedDate).toLocaleDateString() : "-"}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Registered Date :</th>
                                          <td>{forms.logCreatedDate ? new Date(forms.logCreatedDate).toLocaleString() : (forms.createdAt ? new Date(forms.createdAt).toLocaleString() : "-")}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Last Updated :</th>
                                          <td>{forms.logModifiedDate ? new Date(forms.logModifiedDate).toLocaleString() : "-"}</td>
                                        </tr>
                                      </tbody>
                                    </Table>
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>

                            <Col lg={6}>
                              <Card className="border shadow-none mb-4">
                                <CardBody>
                                  <h5 className="font-size-15 mb-3 border-bottom pb-2">Banking & Targets</h5>
                                  <div className="table-responsive">
                                    <Table className="table-nowrap mb-0">
                                      <tbody>
                                        <tr>
                                          <th scope="row" style={{ width: "40%" }}>Bank Name :</th>
                                          <td>{forms.bankName || "-"}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Account Holder :</th>
                                          <td>{forms.accountHolderName || "-"}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Account Number :</th>
                                          <td>{forms.accountNumber || "-"}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Branch :</th>
                                          <td>{forms.branchName || "-"}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">IFSC Code :</th>
                                          <td>{forms.IFSC || "-"}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Monthly Target :</th>
                                          <td>{targets.monthTarget || "-"}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Wallet Balance :</th>
                                          <td>{forms.wallet || "0"}</td>
                                        </tr>
                                      </tbody>
                                    </Table>
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="7">
                          <Row className="mb-3">
                            <Col md={6}>
                              <h5 className="mb-3">KYC Details: </h5>
                            </Col>
                            <Col md={6}>
                              <Button
                                onClick={toggleKycModal}
                                size="md"
                                className="m-1"
                                color="primary"
                                style={{ float: "right" }}
                              >
                                Upload KYC Images
                              </Button>
                            </Col>
                          </Row>
                          {kycData ? (
                            <Row>
                              <Col md={6} className="text-center mb-3">
                                <h6 className="mb-3">Aadhaar Card</h6>
                                {kycData.aadhaarImage ? (
                                  <img
                                    src={URLS.Base + kycData.aadhaarImage}
                                    alt="Aadhaar Card"
                                    style={{
                                      width: "100%",
                                      maxWidth: "400px",
                                      border: "1px solid #ddd",
                                      borderRadius: "4px",
                                      padding: "5px",
                                    }}
                                  />
                                ) : (
                                  <p>Aadhaar image not available.</p>
                                )}
                              </Col>
                              <Col md={6} className="text-center mb-3">
                                <h6 className="mb-3">PAN Card</h6>
                                {kycData.panImage ? (
                                  <img
                                    src={URLS.Base + kycData.panImage}
                                    alt="PAN Card"
                                    style={{
                                      width: "100%",
                                      maxWidth: "400px",
                                      border: "1px solid #ddd",
                                      borderRadius: "4px",
                                      padding: "5px",
                                    }}
                                  />
                                ) : (
                                  <p>PAN image not available.</p>
                                )}
                              </Col>
                              {kycData.videoPath && kycData.videoPath !== "" && (
                                <Col md={12} className="mt-4">
                                  <h5 className="mb-3">Video Kyc: </h5>
                                  <Row className="d-flex justify-content-center">
                                    <Col md={8}>
                                      <iframe src={URLS.Base + kycData.videoPath} width="90%" height="400px" frameBorder="0" allow="encrypted-media" allowFullScreen title="KYC Video" ></iframe>
                                    </Col>
                                  </Row>
                                </Col>
                              )}
                              {kycData.driveUrl && kycData.driveUrl !== "" && (
                                <Col md={12} className="mt-4">
                                  <h5 className="mb-3">Drive Link: </h5>
                                  <a href={kycData.driveUrl} target="_blank" rel="noopener noreferrer">
                                    {kycData.driveUrl}
                                  </a>
                                </Col>
                              )}
                            </Row>
                          ) : (<p className="text-center">No KYC details available.</p>)}
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
          isOpen={modal_kyc}
          toggle={toggleKycModal}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="kycModalLabel">
              Upload KYC Images
            </h5>
            <button
              onClick={() => {
                setmodal_kyc(false)
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
            <Form onSubmit={handleKycUpload}>
              <Col md={12}>
                <div className="mb-3">
                  <Label>Aadhaar Card Image</Label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleAadhaarChange}
                  />
                </div>
              </Col>
              <Col md={12}>
                <div className="mb-3">
                  <Label>PAN Card Image</Label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handlePanChange}
                  />
                </div>
              </Col>
              <Col md={12}>
                <div className="text-center mb-3">
                  <span className="text-muted fw-bold">OR</span>
                </div>
              </Col>
              <Col md={12}>
                <div className="mb-3">
                  <Label>Drive Folder URL</Label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Enter Drive folder link containing Aadhaar and PAN"
                    value={driveUrl}
                    onChange={e => setDriveUrl(e.target.value)}
                  />
                </div>
              </Col>
              <div style={{ float: "right" }}>
                <Button onClick={() => setmodal_kyc(false)} color="danger" type="button">
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button className="m-1" color="primary" type="submit">
                  Submit <i className="fas fa-upload"></i>
                </Button>
              </div>
            </Form>
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

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
  Label,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import ReactPaginate from "react-paginate"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import gig from "../../assets/images/what.gif"
import mark from "../../assets/images/mark1.gif"
import { saveAs } from "file-saver"
import { CSVLink } from "react-csv"
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
    datass()
  }, [])

  const GetAtps = () => {
    var token = datas
    axios
      .post(
        URLS.GetAllSales,
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

  console.log(Actin)
  
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

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const [modal_small2, setmodal_small2] = useState(false)

  const [form, setform] = useState([])

  function tog_small2(data) {
    setmodal_small2(!modal_small2)
    setform(data)
  }

  const Approved = () => {
    var token = datas
    var remid = { promoterId: form.promoterId, saleId: form._id }

    axios
      .post(URLS.ApprovedSales, remid, {
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

  const [search, setsearch] = useState([])

  const searchAll = e => {
    let myUser = { ...search }
    myUser[e.target.name] = e.target.value
    setsearch(myUser)

    var token = datas
    axios
      .post(
        URLS.GetAllSalesSearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setActin(res.data.data)
      })
  }

  const downloadImage = data => {
    saveAs(URLS.Base + data.invoicePath)
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
            setmodal_small1(false)
            GetAtps()
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

  const [exportModal, setExportModal] = useState(false)
  const [exportDateRange, setExportDateRange] = useState({ startDate: '', endDate: '' })

  const getExportData = () => {
    let filteredData = Actin

    if (exportDateRange.startDate && exportDateRange.endDate) {
      const start = new Date(exportDateRange.startDate)
      const end = new Date(exportDateRange.endDate)
      end.setHours(23, 59, 59, 999)

      filteredData = Actin.filter(item => {
        const itemDate = new Date(item.saleDate)
        return itemDate >= start && itemDate <= end
      })
    }

    return [...filteredData].reverse().map(item => {
      let row = {}
      row["Promoter Name"] = item.promoter?.name || ""
      row["Store Name"] = item.promoter?.storeName || ""
      row["Brand Name"] = item.brandName || ""
      row["Category Name"] = item.categoryName || ""
      row["Product Name"] = item.productName || ""
      row["Price"] = item.price || ""
      row["Selling Price"] = item.sellingPrice || ""
      row["Incentive"] = item.incentive || ""
      row["Invoice"] = URLS.Base + item.invoicePath
      return row
    })
  }

  const handleExport = () => {
    const data = getExportData()
    if (data.length === 0) {
      toast("No data to export for the selected date range")
      return
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(fieldName => {
          let val = row[fieldName] === null || row[fieldName] === undefined ? "" : String(row[fieldName]);
          val = val.replace(/"/g, '""');
          return `"${val}"`;
        }).join(",")
      )
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "Sales_Export.csv")
    setExportModal(false)
  }

  console.log(Actin)
  
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Whatnot" breadcrumbItem="Sales list" />

          <Row>
            <Col>
              <Card className="shadow-sm">
                <div className="card-header bg-white border-bottom">
                  <h4 className="card-title mb-0">Sales Management</h4>
                </div>
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
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 mt-2">
                          <Button color="success" onClick={() => setExportModal(true)}>
                            <i className="fas fa-file-export me-1"></i> Export Data
                          </Button>
                          <div className="input-group mt-2 mt-sm-0" style={{ width: "250px" }}>
                            <span className="input-group-text bg-light border-end-0"><i className="bx bx-search-alt"></i></span>
                            <Input
                              type="search"
                              className="form-control border-start-0"
                              placeholder="Search.."
                              value={search.search}
                              onChange={searchAll}
                              name="search"
                            />
                          </div>
                        </div>
                    <div className="table-rep-plugin table-responsive mb-4" style={{ maxHeight: "500px", overflow: "auto" }}>
                      <Table hover className="table table-bordered mb-0">
                          <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                            <tr className="text-center">
                              <th>SlNo</th>
                              <th>Date</th>
                              <th>Store Name</th>
                              <th>Promoter Image</th>
                              <th>Promoter Name</th>
                              <th>Promoter Number</th>
                              <th>Promoter Email</th>
                              <th>Brand Name</th>
                              <th>Category Name</th>
                              <th>Product Name</th>
                              <th>Price</th>
                              <th>Selling Price</th>
                              <th>Serial Number</th>
                              <th>Incentive</th>
                              <th>Invoice</th>
                              <th>Price Miss Match</th>
                              <th>Reject Reason</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lists.map((data, key) => (
                              <tr key={key} className="text-center">
                                <td>{(pageNumber - 1) * 5 + key + 6}</td>
                                <td>{data.saleDate.slice(0, 10)}</td>
                                <td>{data.promoter.storeName}</td>
                                <td>
                                  <img
                                    src={URLS.Base + data.promoter.profilePic}
                                    alt=""
                                    className=" rounded-circle"
                                    style={{ height: "50px", width: "50px", objectFit: "cover" }}
                                  />
                                </td>
                                <td>{data.promoter.name}</td>
                                <td>{data.promoter.phone}</td>
                                <td>{data.promoter.email}</td>
                                <td>{data.brandName}</td>
                                <td>{data.categoryName}</td>
                                <td>{data.productName}</td>
                                <td>{data.price}</td>
                                <td>{data.sellingPrice}</td>
                                <td>{data.serialNumber}</td>
                                <td>{data.incentive}</td>
                                <td>
                                  <Button
                                    outline
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      window.open(URLS.Base + data.invoicePath, "_blank")
                                    }}
                                    onContextMenu={(e) => {
                                      e.preventDefault()
                                      downloadImage(data)
                                    }}
                                    className="m-1"
                                    color="info"
                                    title="Left-click to Open, Right-click to Download"
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
                                      URLS.Base + data.priceMatchScreenshotPath
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={
                                        URLS.Base +
                                        data.priceMatchScreenshotPath
                                      }
                                    style={{ height: "60px", width: "60px", objectFit: "cover", borderRadius: "8px" }}
                                    ></img>
                                  </a>
                                </td>
                                <td>
                                  {data.reason == "" ? (
                                    <>-</>
                                  ) : (
                                    <>{data.reason}</>
                                  )}
                                </td>
                                <td>
                                  {data.status == "approved" ? (
                                    <>
                                      <span className="badge bg-success ">
                                        {data.status}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="badge bg-danger ">
                                        {data.status}
                                      </span>
                                    </>
                                  )}
                                </td>
                                <td>
                                  {data.status == "approved" ||
                                  data.status == "rejected" ? (
                                    "-"
                                  ) : (
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
                                  )}
                                  {data.status == "approved" ||
                                  data.status == "rejected" ? (
                                    ""
                                  ) : (
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
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                    </div>
                    <div className="d-flex justify-content-end mt-3 mb-1">
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
            {" "}
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
          <div className="modal-body pt-4">
            <div className="text-center mb-4">
              <img src={mark} alt="Approve" width="120px" />
              <h5 className="mt-3">Approve Sale?</h5>
              <p className="text-muted">Are you sure you want to approve this sale?</p>
            </div>

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
                  className="m-1"
                  color="primary"
                  onClick={() => {
                    Approved()
                  }}
                >
                  Submit <i className="fas fa-check-circle"></i>
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
              <div className="text-center mb-4">
                <img src={Trash} alt="Reject" width="120px" />
                <h5 className="mt-3">Reject Sale</h5>
              </div>

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

          <Modal isOpen={exportModal} toggle={() => setExportModal(!exportModal)} centered>
            <div className="modal-header">
              <h5 className="modal-title">Export Sales Data</h5>
              <button type="button" className="close" onClick={() => setExportModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h6 className="mb-3">Date Range (Optional)</h6>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label>Start Date</Label>
                    <Input 
                      type="date" 
                      value={exportDateRange.startDate} 
                      onChange={e => setExportDateRange({...exportDateRange, startDate: e.target.value})} 
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label>End Date</Label>
                    <Input 
                      type="date" 
                      value={exportDateRange.endDate} 
                      onChange={e => setExportDateRange({...exportDateRange, endDate: e.target.value})} 
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div className="modal-footer">
              <Button color="secondary" onClick={() => setExportModal(false)}>Cancel</Button>
              <Button color="success" onClick={handleExport}>
                <i className="fas fa-file-excel me-1"></i> Download Excel
              </Button>
            </div>
          </Modal>
          <ToastContainer />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Ventures

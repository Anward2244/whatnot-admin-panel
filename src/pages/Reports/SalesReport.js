import React, { useState, useEffect } from "react"
import {
  CardBody,
  Container,
  Row,
  Col,
  Card,
  Form,
  Label,
  Input,
  Button,
  Table,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"
import axios from "axios"
import { CSVLink } from "react-csv"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { URLS } from "../../Url"

function PaymentReport() {
  const [Actin, setActin] = useState([])

  const [userInCsv, setuserInCsv] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const ActinReport = () => {
    var token = datas
    const data = { fromDate: "", toDate: "" }

    axios
      .post(URLS.SalesReports, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setActin(res.data.data)
        setuserInCsv(res.data.data)
      })
  }

  useEffect(() => {
    ActinReport()
  }, [])

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = Actin.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Actin.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const [filter, setfilter] = useState(false)

  const [filters, setfilters] = useState({
    fromDate: "",
    toDate: "",
  })

  const getfilter = e => {
    e.preventDefault()
    GetActinFiliter()
  }

  const GetActinFiliter = () => {
    var token = datas
    const data = {
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    }
    axios
      .post(URLS.SalesReports, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setActin(res.data.data)
        setuserInCsv(res.data.data)
        hidefilter()
        setfilters("")
      })
  }

  const hidefilter = () => setfilter(false)

  const handleChangeflt = e => {
    let myUser = { ...filters }
    myUser[e.target.name] = e.target.value
    setfilters(myUser)
  }

  const csvReport = {
    filename: "Sales Report",
    data: userInCsv,
  }

  const exportPDF = () => {
    const unit = "pt"
    const size = "A2"
    const orientation = "portrait"

    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const headers = [
      [
        "S.No",
        "Store Name",
        "Employee Name",
        "Employee Number",
        "Employee Email",
        "Brand Name",
        "Category Name",
        "Product Name",
        "Price",
        "Serial Number",
        "Incentive",
        "Status",
      ],
    ]

    const data = Actin.map((elt, i) => [
      i + 1,
      elt.promoter.storeName,
      elt.promoter.name,
      elt.promoter.phone,
      elt.promoter.email,
      elt.brandName,
      elt.categoryName,
      elt.productName,
      elt.price,
      elt.serialNumber,
      elt.incentive,
      elt.status,
    ])
    let content = {
      startY: 50,
      head: headers,
      body: data,
    }
    doc.autoTable(content)
    doc.save("Sales Report.pdf")
  }

  return (
    <div>
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs title="Whatnot" breadcrumbItem="Sales Reports" />

            {filter ? (
              <>
                <Card>
                  <CardBody>
                    <Form
                      onSubmit={e => {
                        getfilter(e)
                      }}
                    >
                      <Row>
                        <Col lg="3">
                          <div className="mb-3">
                            <Label for="basicpill-declaration-input10">
                              From Date <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="date"
                              required
                              className="form-control"
                              id="basicpill-Declaration-input10"
                              onChange={e => {
                                handleChangeflt(e)
                              }}
                              name="fromDate"
                              value={filters.fromDate}
                            />
                          </div>
                        </Col>
                        <Col lg="3">
                          <div className="mb-3">
                            <Label for="basicpill-declaration-input10">
                              To Date <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="date"
                              required
                              className="form-control"
                              id="basicpill-Declaration-input10"
                              onChange={e => {
                                handleChangeflt(e)
                              }}
                              name="toDate"
                              value={filters.toDate}
                            />
                          </div>
                        </Col>

                        <Col lg="3">
                          <div className="mt-4">
                            <Button type="submit" className="m-1" color="info">
                              <i className="fas fa-check-circle"></i> search
                            </Button>
                            <Button
                              onClick={hidefilter}
                              className="m-1"
                              color="danger"
                            >
                              <i className="fas fa-times-circle"></i> Cancel
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </>
            ) : (
              ""
            )}

            <Card>
              <CardBody>
                <div>
                  <div className="table-responsive">
                    <div className="col-sm-12">
                      <div style={{ float: "right" }}>
                        <Row>
                          <Col>
                            <div style={{ float: "right" }}>
                              <CSVLink {...csvReport}>
                                <button
                                  className="btn btn-success me-2"
                                  type="submit"
                                >
                                  <i className="fas fa-file-excel"></i> Excel
                                </button>
                              </CSVLink>
                              <Button
                                type="button"
                                className="btn btn-danger "
                                onClick={exportPDF}
                              >
                                <i className="fas fa-file-pdf"></i> Pdf
                              </Button>

                              <Button
                                className="m-1"
                                onClick={() => {
                                  setfilter(!filter)
                                }}
                                color="info"
                              >
                                <i className="fas fa-filter"></i> Filter
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Table
                        id="empTable"
                        className="table table-bordered mb-3 mt-5"
                      >
                        <thead className="text-center">
                          <tr>
                            <th>S.No</th>
                            <th>Date</th>
                            <th>Store Name</th>
                            <th>Employee Name</th>
                            <th>Employee Number</th>
                            <th>Employee Email</th>
                            <th>Brand Name</th>
                            <th>Category Name</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Selling Price</th>
                            <th>Serial Number</th>
                            <th>Incentive</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <td>{(pageNumber - 1) * 5 + key + 6}</td>
                              <td>{data.saleDate.slice(0, 10)}</td>
                              <td>{data.promoter.storeName}</td>
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
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    <div className="mt-3" style={{ float: "right" }}>
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
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    </div>
  )
}

export default PaymentReport

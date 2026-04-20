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
      .post(URLS.PaymentReports, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setActin(res.data.totalDebits)
        setuserInCsv(res.data.totalDebits)
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
      .post(URLS.PaymentReports, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setActin(res.data.totalDebits)
        setuserInCsv(res.data.totalDebits)
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
    filename: "Payment Report",
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
        "SlNo",
        "Date / Time",
        "Employee Store Name",
        "Employee Name",
        "Employee Number",
        "Employee Email",
        "Transaction Id ",
        "Wallet Request",
        "Status",
      ],
    ]

    const data = Actin.map((elt, i) => [
      i + 1,
      elt.date + elt.time,
      elt.promoterStoreName,
      elt.promoterName,
      elt.phone,
      elt.email,
      elt.transactionId,
      elt.amount,
      elt.status,
    ])
    let content = {
      startY: 50,
      head: headers,
      body: data,
    }
    doc.autoTable(content)
    doc.save("Payment Report.pdf")
  }

  return (
    <div>
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs title="Whatnot" breadcrumbItem="Payment Reports" />

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
                            <th>SlNo</th>
                            <th>Date / Time</th>
                            <th>Employee Store Name</th>
                            <th>Employee Name</th>
                            <th>Employee Number</th>
                            <th>Employee Email</th>
                            <th>Transaction Id </th>
                            <th>Wallet Request </th>
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
                              <td>{data.promoterName}</td>
                              <td>{data.phone}</td>
                              <td>{data.email}</td>
                              <td>{data.transactionId}</td>
                              <td>{data.amount}</td>
                              <td>
                                {data.status == "paid" ? (
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

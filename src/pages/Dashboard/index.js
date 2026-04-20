import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap"
import ReactApexChart from "react-apexcharts"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { URLS } from "../../Url"
import axios from "axios"

const Dashboard = () => {
  const [form, setform] = useState([])

  const [Promoters, setPromoters] = useState([])

  useEffect(() => {
    GetSettings()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const GetSettings = () => {
    var token = datas

    axios
      .post(
        URLS.GetDashboad,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setform(res.data)
        setPromoters(res.data.promoters)
      })
  }

  const reports = [
    {
      title: "Total Employees",
      iconClass: "bx-copy-alt",
      description: form.promotersCount,
    },
    {
      title: "Total Sales",
      iconClass: "bx-archive-in",
      description: form.salesCount,
    },
    {
      title: "Total Products",
      iconClass: "bx bx-user-check",
      description: form.totalProducts,
    },
    {
      title: "Total Incentive Amount",
      iconClass: "bx bx-user-x",
      description: form.totalIncentives,
    },
  ]

  const series = [
    {
      name: "Sales",
      data: form.saleStats,
    },
    {
      name: "Employees",
      data: form.promoterStats,
    },
  ]

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },

    colors: ["#000", "#D85F26"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: " (data)",
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        },
      },
    },
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Whatnot"} breadcrumbItem={"Dashboard"} />

          <Row>
            <Col xl="12">
              <Row>
                {reports.map((report, key) => (
                  <Col md="3" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i
                                className={
                                  "bx " + report.iconClass + " font-size-24"
                                }
                              ></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card className="overflow-hidden">
                <CardBody>
                  <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={350}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <div>
                <Card>
                  <CardBody>
                    <h5 className="mb-3">Latest Employees</h5>
                    <div className="table-rep-plugin ">
                      <Table hover bordered responsive>
                        <thead className="bg-light ">
                          <tr className="text-center">
                            <th>Sl No</th>
                            <th>Employee Image</th>
                            <th>Employee Store Name</th>
                            <th>Employee Name</th>
                            <th>Employee Number</th>
                            <th>Employee Email </th>
                            <th>Employee Status </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Promoters.map((data, i) => (
                            <tr key={i} className=" text-center">
                              <th>{i + 1}</th>
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
                              <td>{data.phone} </td>
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
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard

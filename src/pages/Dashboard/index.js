import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap"
import ReactApexChart from "react-apexcharts"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { URLS } from "../../Url"
import axios from "axios"

const Dashboard = () => {
  const [form, setform] = useState([])

  const [Promoters, setPromoters] = useState([])
  const [allPromoters, setAllPromoters] = useState([])
  const [allSales, setAllSales] = useState([])
  const [selectedMetric, setSelectedMetric] = useState("sales")

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

    // Fetch all promoters for the Donut Chart mapping
    axios
      .post(
        URLS.GetAllPromoters,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setAllPromoters(res.data.data || res.data || [])
      })

    // Fetch all sales to calculate the metric counts
    axios
      .post(
        URLS.GetAllSales,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setAllSales(res.data.data || res.data || [])
      })
  }
  console.log(Promoters)

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

  // Pie charts take a single-dimensional array for data. 
  // Here we display the monthly sales data.
  const totalsSeries = [
    form.promotersCount || 0,
    form.salesCount || 0,
    form.totalProducts || 0,
    form.totalIncentives || 0,
  ]

  const totalsOptions = {
    chart: { type: "pie" },
    labels: [
      "Total Employees",
      "Total Sales",
      "Total Products",
      "Total Incentive Amount",
    ],
    colors: ["#556ee6", "#34c38f", "#f1b44c", "#f46a6a"], // Primary, Success, Warning, Danger
    legend: { position: "bottom" },
  }

  const monthlySalesSeries = form.saleStats || []
  const monthlyEmployeesSeries = form.promoterStats || []

  const monthlyOptions = {
    chart: {
      type: "pie",
    },
    colors: ["#556ee6", "#34c38f", "#f1b44c", "#f46a6a", "#50a5f1", "#343a40", "#e83e8c", "#20c997", "#6f42c1", "#fd7e14", "#0ab39c", "#17a2b8"],
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    legend: {
      position: "bottom",
    },
  }

  const getMetricValue = (data, metric) => {
    let statusFilter = "approved";
    if (metric === "pending") statusFilter = "pending";
    if (metric === "rejected") statusFilter = "rejected";
    
    // Filter sales by matching the promoter's ID and the selected status
    const count = allSales.filter(sale => {
      const pId = sale.promoterId || sale.promoter_id || (sale.promoter && sale.promoter._id);
      return pId === data._id && sale.status === statusFilter;
    }).length;

    return count;
  };

  // Cycle through the website's brand color palette for the donut chart slices
  const generateColors = (num) => {
    const baseColors = ["#556ee6", "#34c38f", "#f1b44c", "#f46a6a", "#50a5f1", "#343a40", "#e83e8c", "#20c997", "#6f42c1", "#fd7e14"];
    const colors = []
    for (let i = 0; i < num; i++) {
      colors.push(baseColors[i % baseColors.length])
    }
    return colors
  }

  // Filter promoters who actually have data for the selected metric
  const filteredPromoters = allPromoters.filter(data => getMetricValue(data, selectedMetric) > 0);

  // Store Sales Chart Options mapping dynamically from filteredPromoters
  const storeSalesSeries = filteredPromoters.length > 0 
    ? filteredPromoters.map(data => getMetricValue(data, selectedMetric)) 
    : []
    
  const storeSalesOptions = {
    chart: {
      type: "donut",
    },
    colors: filteredPromoters.length > 0 ? generateColors(filteredPromoters.length) : [],
    labels: filteredPromoters.length > 0 
      ? filteredPromoters.map(data => data.name || data.storeName || "Unknown") 
      : [],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const count = opts.w.config.series[opts.seriesIndex];
        const data = filteredPromoters[opts.seriesIndex];
        
        let statusFilter = "approved";
        if (selectedMetric === "pending") statusFilter = "pending";
        if (selectedMetric === "rejected") statusFilter = "rejected";
        
        const promoterSales = allSales.filter(sale => {
          const pId = sale.promoterId || sale.promoter_id || (sale.promoter && sale.promoter._id);
          return pId === data._id && sale.status === statusFilter;
        });
        
        const totalValue = promoterSales.reduce((acc, curr) => acc + (Number(curr.sellingPrice) || Number(curr.price) || 0), 0);

        return [count + " Sales", "₹" + totalValue];
      },
    },
    legend: {
      position: "right",
      horizontalAlign: "center",
      floating: false,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, w }) {
        const data = filteredPromoters[seriesIndex]
        if (data) {
          const statusColor = data.kycStatus === "approved" ? "success" : data.kycStatus === "pending" ? "warning" : "danger"
          
          let statusFilter = "approved";
          if (selectedMetric === "pending") statusFilter = "pending";
          if (selectedMetric === "rejected") statusFilter = "rejected";
          
          const promoterSales = allSales.filter(sale => {
            const pId = sale.promoterId || sale.promoter_id || (sale.promoter && sale.promoter._id);
            return pId === data._id && sale.status === statusFilter;
          });
          
          const totalValue = promoterSales.reduce((acc, curr) => acc + (Number(curr.sellingPrice) || Number(curr.price) || 0), 0);

          return `
            <div style="padding: 12px; min-width: 220px; line-height: 1.6; background: #fff; border-radius: 5px;">
              <h6 style="margin-top: 0; margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #eff2f7; padding-bottom: 8px;">
                ${data.name || "Employee"} (${data.storeName || "Store"})
              </h6>
              <div style="font-size: 13px;">
                <div><b>Employee:</b> ${data.name || "-"}</div>
                <div><b>Email:</b> ${data.email || "-"}</div>
                <div><b>Phone:</b> ${data.phone || "-"}</div>
                <div style="margin-top: 4px;"><b>Status:</b> <span class="badge bg-${statusColor}">${data.kycStatus || data.kyc}</span></div>
                <div style="margin-top: 8px; font-weight: bold; color: #556ee6;">
                  ${selectedMetric === "sales" ? "Completed Sales" : selectedMetric === "pending" ? "Pending Sales" : "Rejected Sales"}: ${series[seriesIndex]}<br/>
                  Total Value: ${totalValue}
                </div>
              </div>
            </div>
          `
        }
        return ""
      },
    },
  }

  // Check if we have actual data to display
  const hasDonutData = storeSalesSeries.length > 0;

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

              <Row>
                <Col md="4">
                  <Card className="overflow-hidden">
                    <CardBody>
                      <h4 className="card-title mb-4">Overall Totals</h4>
                      <ReactApexChart
                        options={totalsOptions}
                        series={totalsSeries}
                        type="pie"
                        height={350}
                      />
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card className="overflow-hidden">
                    <CardBody>
                      <h4 className="card-title mb-4">Monthly Sales</h4>
                      <ReactApexChart
                        options={monthlyOptions}
                        series={monthlySalesSeries}
                        type="pie"
                        height={350}
                      />
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card className="overflow-hidden">
                    <CardBody>
                      <h4 className="card-title mb-4">Monthly Employees</h4>
                      <ReactApexChart
                        options={monthlyOptions}
                        series={monthlyEmployeesSeries}
                        type="pie"
                        height={350}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <Card>
                    <CardBody>
                      <div className="d-sm-flex flex-wrap mb-4">
                        <h4 className="card-title">Promoter Information</h4>
                        <div className="ms-auto">
                          <ul className="nav nav-pills">
                            <li className="nav-item">
                              <a
                                className={`nav-link ${selectedMetric === "sales" ? "active" : ""}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setSelectedMetric("sales"); }}
                              >
                                Completed Sales
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className={`nav-link ${selectedMetric === "pending" ? "active" : ""}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setSelectedMetric("pending"); }}
                              >
                                Pending Sales
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className={`nav-link ${selectedMetric === "rejected" ? "active" : ""}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setSelectedMetric("rejected"); }}
                              >
                                Rejected Sales
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      {hasDonutData ? (
                        <ReactApexChart
                          options={storeSalesOptions}
                          series={storeSalesSeries}
                          type="donut"
                          height={350}
                        />
                      ) : (
                        <div className="text-center text-muted mt-4 mb-4 py-5">
                          <p>No data available for the selected metric.</p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
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

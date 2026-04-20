import React, { useState, useEffect } from "react"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  Table,
  Modal,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import axios from "axios"
import { URLS } from "../../Url"
import gig from "../../assets/images/what.gif"
// import { CSVLink } from "react-csv"
import Productses from "../../assets/images/Products1.xlsx"

const Banner = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [modal_small1, setmodal_small1] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [banner, setbanner] = useState([])
  const [form, setform] = useState([])
  const [form1, setform1] = useState([])

  const [filter, setfilter] = useState(false)

  const hidefilter = () => setfilter(false)

  function tog_small() {
    setmodal_small(!modal_small)
  }

  function tog_small1() {
    setmodal_small1(!modal_small1)
  }

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }
  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  useEffect(() => {
    GetAllBanners()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = banner.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(banner.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const AddBanner = () => {
    var token = datas
    const dataArray = {
      brand_id: form.brand_id,
      category_id: form.category_id,
      description: form.description,
      serialNumber: form.serialNumber,
      incentive: form.incentive,
      price: form.price,
      product_name: form.product_name,
      EANcode: form.EANcode,
      SKUid: form.SKUid,
    }

    axios
      .post(URLS.UpdateProduct, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
            clearForm()
            hidefilter()
            setIsLoading(true)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const EditBanner = () => {
    var token = datas
    const dataArray = {
      product_id: form1._id,
      brand_id: form1.brand_id,
      category_id: form1.category_id,
      description: form1.description,
      serialNumber: form1.serialNumber,
      incentive: form1.incentive,
      price: form1.price,
      product_name: form1.name,
      EANcode: form1.EANcode,
      SKUid: form1.SKUid,
    }

    axios
      .post(URLS.UpdateProduct, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
            setmodal_small(false)
            setIsLoading(true)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const DeleteBanner = data => {
    var token = datas
    var remid = { product_id: data._id }
    axios
      .post(URLS.deleteProduct, remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      DeleteBanner(data)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    AddBanner()
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    EditBanner()
  }

  const GetAllBanners = () => {
    var token = datas
    axios
      .post(
        URLS.getProducts,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.products)
        setIsLoading(false)
      })
  }

  const clearForm = () => {
    setform({
      brand_id: "",
      category_id: "",
      description: "",
      serialNumber: "",
      incentive: "",
      price: "",
      product_name: "",
      EANcode: "",
      SKUid: "",
    })
  }

  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  const getpopup1 = () => {
    tog_small1()
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const [brand, setbrand] = useState([])

  useEffect(() => {
    getbrand()
  }, [])

  const getbrand = () => {
    var token = datas
    axios
      .post(
        URLS.getBrand,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbrand(res.data.brands)
      })
  }

  const [Category, setCategory] = useState([])

  useEffect(() => {
    getCategory()
  }, [])

  const getCategory = () => {
    var token = datas
    axios
      .post(
        URLS.getCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setCategory(res.data.categories)
      })
  }
  const csvData = []

  const [files, setFiles] = useState([])

  const changeHandler = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (type == "csv" || type == "CSV" || type == "XLSX" || type == "xlsx") {
      setFiles(e.target.files)
    } else {
      e.target.value = null
      toast("file format not supported Pls choose Csv File")
    }
  }

  const handleSubmit2 = e => {
    e.preventDefault()
    EditBanner2()
  }

  const EditBanner2 = () => {
    var token = datas
    const dataArray = new FormData()

    for (let i = 0; i < files.length; i++) {
      dataArray.append("products", files[i])
    }

    axios
      .post(URLS.BlukUploadProduct, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
            setmodal_small1(false)
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
        URLS.getProductsSearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.products)
        setIsLoading(false)
      })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Whatnot" breadcrumbItem="Products" />

          <Row>
            {filter ? (
              <>
                <Col md={12}>
                  <Card>
                    <CardHeader className="bg-white">
                      <CardTitle>Add Product </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form
                        onSubmit={e => {
                          handleSubmit(e)
                        }}
                      >
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label> Brand Name</Label>
                              <span className="text-danger">*</span>
                              <select
                                value={form.brand_id}
                                name="brand_id"
                                onChange={e => {
                                  handleChange(e)
                                }}
                                className="form-select"
                              >
                                <option value="">Select</option>
                                {brand.map((data, key) => {
                                  return (
                                    <option key={key} value={data._id}>
                                      {data.name}
                                    </option>
                                  )
                                })}
                              </select>
                            </div>
                          </Col>

                          <Col md={6}>
                            <div className="mb-3">
                              <Label> Category Name</Label>
                              <span className="text-danger">*</span>
                              <select
                                value={form.category_id}
                                name="category_id"
                                onChange={e => {
                                  handleChange(e)
                                }}
                                className="form-select"
                              >
                                <option value="">Select</option>
                                {Category.map((data, key) => {
                                  return (
                                    <option key={key} value={data._id}>
                                      {data.name}
                                    </option>
                                  )
                                })}
                              </select>
                            </div>
                          </Col>

                          <Col md={6}>
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                Product Name
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter Product Name"
                                required
                                name="product_name"
                                value={form.product_name}
                                onChange={e => {
                                  handleChange(e)
                                }}
                              />
                            </div>
                          </Col>

                          <Col md={6}>
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                Price <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter Price"
                                required
                                name="price"
                                value={form.price}
                                onChange={e => {
                                  handleChange(e)
                                }}
                              />
                            </div>
                          </Col>

                          <Col md={6}>
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                Incentive <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter Incentive"
                                required
                                name="incentive"
                                value={form.incentive}
                                onChange={e => {
                                  handleChange(e)
                                }}
                              />
                            </div>
                          </Col>

                          <Col md={6}>
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                Serial Number
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter Serial Number"
                                required
                                name="serialNumber"
                                value={form.serialNumber}
                                onChange={e => {
                                  handleChange(e)
                                }}
                              />
                            </div>
                          </Col>

                          <Col md={6}>
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                Ean Number <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter Ean Number"
                                required
                                name="EANcode"
                                value={form.EANcode}
                                onChange={e => {
                                  handleChange(e)
                                }}
                              />
                            </div>
                          </Col>

                          <Col md={6}>
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                SKU Id <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter SKU Id"
                                required
                                name="SKUid"
                                value={form.SKUid}
                                onChange={e => {
                                  handleChange(e)
                                }}
                              />
                            </div>
                          </Col>

                          <Col md={6}>
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                Description
                                <span className="text-danger">*</span>
                              </Label>
                              <textarea
                                type="text"
                                rows="4"
                                className="form-control "
                                id="basicpill-firstname-input1"
                                placeholder="Enter Description"
                                required
                                value={form.description}
                                name="description"
                                onChange={e => {
                                  handleChange(e)
                                }}
                              />
                            </div>
                          </Col>

                          <Col md={12}>
                            <div style={{ float: "right" }}>
                              <Button
                                className="m-1"
                                color="danger"
                                type="button"
                                onClick={() => {
                                  hidefilter()
                                }}
                              >
                                Cancel
                              </Button>
                              <Button color="primary" type="submit">
                                Submit <i className="fas fa-check-circle"></i>
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </>
            ) : (
              ""
            )}
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
                    <CardHeader className="bg-white">
                      <CardTitle>Product List</CardTitle>
                    </CardHeader>

                    <CardBody>
                      <div>
                        <Row>
                          <Col md={6}>
                            <Button
                              className="m-1"
                              onClick={() => {
                                setfilter(!filter)
                              }}
                              color="primary"
                            >
                              <i className="fas fa-filter"></i> Add Product
                            </Button>
                          </Col>
                          <Col md={6}>
                            {/* <CSVLink data={csvData}  id="buttonk"> */}
                            <a
                              href={Productses}
                              className="btn btn-danger"
                              id="buttonk"
                              style={{ float: "right" }}
                            >
                              Sample Excel File
                            </a>
                            {/* </CSVLink> */}

                            <Button
                              onClick={() => {
                                getpopup1()
                              }}
                              className="mr-2"
                              style={{
                                padding: "6px",
                                margin: "3px",
                                float: "right",
                              }}
                              color="success"
                            >
                              <i className="bx bx-edit"> Excel File Upload</i>
                            </Button>
                          </Col>
                        </Row>

                        <div className="table-responsive">
                          <div style={{ float: "right" }} className="mt-3 mb-3">
                            <Input
                              type="search"
                              className="form-control"
                              placeholder="Search by Product Name"
                              value={search.search}
                              onChange={searchAll}
                              name="search"
                            />
                          </div>
                          <Table className="table table-bordered mb-4 mt-5">
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Brand Name </th>
                                <th>Category Name</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Incentive </th>
                                <th>Serial Number </th>
                                <th>Ean Code</th>
                                <th>SKU Id</th>
                                <th>Description</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lists.map((data, key) => (
                                <tr key={key}>
                                  <th>{(pageNumber - 1) * 5 + key + 6}</th>
                                  <td>{data.brandName}</td>
                                  <td>{data.categoryName}</td>
                                  <td>{data.name}</td>
                                  <td>{data.price}</td>
                                  <td>{data.incentive}</td>
                                  <td>{data.serialNumber}</td>
                                  <td>{data.EANcode}</td>
                                  <td>{data.SKUid}</td>
                                  <td>{data.description}</td>
                                  <td>
                                    <Button
                                      onClick={() => {
                                        getpopup(data)
                                      }}
                                      className="mr-2"
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="success"
                                      outline
                                    >
                                      <i className="bx bx-edit "></i>
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        manageDelete(data)
                                      }}
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="danger"
                                      outline
                                    >
                                      <i className="bx bx-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>

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
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal
          size="lg"
          isOpen={modal_small}
          toggle={() => {
            tog_small()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Product
            </h5>
            <button
              onClick={() => {
                setmodal_small(false)
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
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label> Brand Name</Label>
                    <span className="text-danger">*</span>
                    <select
                      value={form1.brand_id}
                      name="brand_id"
                      onChange={e => {
                        handleChange1(e)
                      }}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      {brand.map((data, key) => {
                        return (
                          <option key={key} value={data._id}>
                            {data.name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label> Category Name</Label>
                    <span className="text-danger">*</span>
                    <select
                      value={form1.category_id}
                      name="category_id"
                      onChange={e => {
                        handleChange1(e)
                      }}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      {Category.map((data, key) => {
                        return (
                          <option key={key} value={data._id}>
                            {data.name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Product Name <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="basicpill-firstname-input1"
                      placeholder="Enter Product Name"
                      required
                      name="name"
                      value={form1.name}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Price <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      className="form-control"
                      id="basicpill-firstname-input1"
                      placeholder="Enter Price"
                      required
                      name="price"
                      value={form1.price}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Incentive <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      className="form-control"
                      id="basicpill-firstname-input1"
                      placeholder="Enter Incentive"
                      required
                      name="incentive"
                      value={form1.incentive}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Serial Number <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="basicpill-firstname-input1"
                      placeholder="Enter Serial Number"
                      required
                      name="serialNumber"
                      value={form1.serialNumber}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Ean Code <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      className="form-control"
                      id="basicpill-firstname-input1"
                      placeholder="Enter Ean Code"
                      required
                      name="EANcode"
                      value={form1.EANcode}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      SKU Id <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="basicpill-firstname-input1"
                      placeholder="Enter SKU Id"
                      required
                      name="SKUid"
                      value={form1.SKUid}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Description <span className="text-danger">*</span>
                    </Label>
                    <textarea
                      type="text"
                      rows="4"
                      className="form-control "
                      id="basicpill-firstname-input1"
                      placeholder="Enter Description"
                      required
                      value={form1.description}
                      name="description"
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <div style={{ float: "right" }}>
                <Button
                  className="m-1"
                  color="danger"
                  type="button"
                  onClick={() => {
                    setmodal_small(false)
                  }}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit">
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
              Edit Bulk Upload
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
                handleSubmit2(e)
              }}
            >
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Excel Bulk Upload <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="file"
                      className="form-control"
                      id="basicpill-firstname-input1"
                      name="image"
                      required
                      value={files.image}
                      onChange={changeHandler}
                    />
                  </div>
                </Col>
              </Row>
              <div style={{ float: "right" }}>
                <Button
                  className="m-1"
                  color="danger"
                  type="button"
                  onClick={() => {
                    setmodal_small1(false)
                  }}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit">
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

export default Banner

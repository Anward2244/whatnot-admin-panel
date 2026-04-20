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

const Banner = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [banner, setbanner] = useState([])
  const [form, setform] = useState([])
  const [form1, setform1] = useState([])

  function tog_small() {
    setmodal_small(!modal_small)
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
      category_name: form.category_name,
    }

    axios
      .post(URLS.UpdateCategory, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
            clearForm()
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
      category_name: form1.name,
      category_id: form1._id,
    }

    axios
      .post(URLS.UpdateCategory, dataArray, {
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
    var remid = { category_id: data._id }
    axios
      .post(URLS.deleteCategory, remid, {
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
        URLS.getCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.categories)
        setIsLoading(false)
      })
  }

  const clearForm = () => {
    setform({
      category_name: "",
    })
  }

  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  const [search, setsearch] = useState([])

  const searchAll = e => {
    let myUser = { ...search }
    myUser[e.target.name] = e.target.value
    setsearch(myUser)

    var token = datas
    axios
      .post(
        URLS.getCategorySearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.categories)
        setIsLoading(false)
      })
  }
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Whatnot" breadcrumbItem="Category" />

          <Row>
            <Col md={4}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Add Category</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      handleSubmit(e)
                    }}
                  >
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Category Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Category Name"
                        required
                        name="category_name"
                        value={form.category_name}
                        onChange={e => {
                          handleChange(e)
                        }}
                      />
                    </div>

                    <div style={{ float: "right" }}>
                      <Button color="primary" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col md={8}>
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
                      <CardTitle>Category List</CardTitle>
                    </CardHeader>

                    <CardBody>
                      <div>
                        <div className="table-responsive">
                          <div style={{ float: "right" }}>
                            <Input
                              type="search"
                              className="form-control"
                              placeholder="Search.."
                              value={search.search}
                              onChange={searchAll}
                              name="search"
                            />
                          </div>
                          <Table className="table table-bordered mb-4 mt-5">
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Category Name</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lists.map((data, key) => (
                                <tr key={key}>
                                  <th>{(pageNumber - 1) * 5 + key + 6}</th>
                                  <td>{data.name}</td>
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
                                    </Button>{" "}
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
          size="md"
          isOpen={modal_small}
          toggle={() => {
            tog_small()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Category
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
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                Category Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Category Name"
                  required
                  name="name"
                  value={form1.name}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>

              <div style={{ float: "right" }}>
                <Button
                  onClick={() => {
                    setmodal_small(false)
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

export default Banner

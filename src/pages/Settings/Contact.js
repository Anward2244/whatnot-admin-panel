import React, { useEffect, useState } from "react"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Table,
  Label,
  Input,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import gig from "../../assets/images/what.gif"
import { URLS } from "../../Url"
import axios from "axios"

function DigitalBrochure() {
  const [isLoading, setIsLoading] = useState(false)

  const [form, setform] = useState([])

  const [forms, setforms] = useState([])

  const handlechange = e => {
    const myform = { ...forms }
    myform[e.target.name] = e.target.value
    setforms(myform)
  }

  useEffect(() => {
    GetAllBroucher()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const GetAllBroucher = () => {
    var token = datas

    axios
      .post(
        URLS.GetContact,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setform(res.data.contactDetails)
        setforms(res.data.contactDetails)
        setIsLoading(false)
      })
  }
  const [modal_small, setmodal_small] = useState(false)
  function tog_small() {
    setmodal_small(!modal_small)
  }

  const getpopup1 = () => {
    tog_small()
  }

  const submibooking = e => {
    e.preventDefault()

    changstatus()
  }

  const changstatus = () => {
    var token = datas
    const Data = {
      officeName: forms.officeName,
      location: forms.location,
      officeEmail: forms.officeEmail,
      officePhonenumber: forms.officePhonenumber,
      pincode: forms.pincode,
    }

    axios
      .post(URLS.UpdateContact, Data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small(false)
            GetAllBroucher()
            setIsLoading(true)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
            setIsLoading(false)
          }
        }
      )
  }

  var gets = localStorage.getItem("authUser")

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Whatnot" breadcrumbItem="Contact Us" />

          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white"></CardHeader>
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
                      <div style={{ float: "right" }}>
                        <Button
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Edit Booking"
                          onClick={() => {
                            getpopup1(form)
                          }}
                          className="mr-5 mb-1 m-1 "
                          color="success"
                          outline
                        >
                          <i className="bx bx-edit text-dark "></i>
                          <span>Edit</span>
                        </Button>
                      </div>

                      <Row>
                        <div className="m-5">
                          <div className="table-rep-plugin mt-4 table-responsive">
                            <Table hover className="table table-bordered mb-4">
                              <thead>
                                <tr className="text-center">
                                  <th>Office Name</th>
                                  <td>{form.officeName}</td>
                                </tr>
                                <tr className="text-center">
                                  <th>Office Email</th>
                                  <td>{form.officeEmail}</td>
                                </tr>
                                <tr className="text-center">
                                  <th>Office Phone Number</th>
                                  <td>{form.officePhonenumber}</td>
                                </tr>

                                <tr className="text-center">
                                  <th>Office Location</th>
                                  <td>{form.location}</td>
                                </tr>
                                <tr className="text-center">
                                  <th>Pincode </th>
                                  <td>{form.pincode}</td>
                                </tr>
                              </thead>
                            </Table>
                          </div>
                        </div>
                      </Row>
                    </CardBody>
                  </>
                )}
              </Card>
            </Col>
          </Row>

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
                Edit Contact Us
              </h5>{" "}
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
                  submibooking(e)
                }}
              >
                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Office Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Office Name"
                        required
                        value={forms.officeName}
                        name="officeName"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                    <Row>
                      {" "}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Office Email<span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Office Email"
                            required
                            value={forms.officeEmail}
                            name="officeEmail"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>{" "}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Office Phone Number
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Office Phone Number"
                            required
                            value={forms.officePhonenumber}
                            name="officePhonenumber"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Pincode <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Pincode"
                            required
                            value={forms.pincode}
                            name="pincode"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Office Location <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        type="text"
                        rows="5"
                        className="form-control "
                        id="basicpill-firstname-input1"
                        placeholder="Enter  Office Location"
                        required
                        value={forms.location}
                        name="location"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>{" "}
                  </Col>
                </Row>
                <hr></hr>
                <div style={{ float: "right" }} className="m-2">
                  <Button className="m-1" type="submit">
                    Submit <i className="fas fa-check-circle"></i>
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default DigitalBrochure

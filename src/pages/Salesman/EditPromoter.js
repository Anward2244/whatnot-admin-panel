import React, { useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import { Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import Dropzone from "react-dropzone"
import axios from "axios"
import { URLS } from "../../Url"

function AddPromoter() {
  const [form, setform] = useState([])
  const [selectedFiles, setselectedFiles] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const handleSubmit = e => {
    e.preventDefault()
    if (selectedFiles.length > 0) {
      AddPromoter()
    } else {
      toast("Please upload image")
    }
  }

  const history = useHistory()
  const AddPromoter = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("name", form.name)
    dataArray.append("phone", form.phone)
    dataArray.append("selectGender", form.selectGender)
    dataArray.append("age", form.age)
    dataArray.append("dateOfBirth", form.dateOfBirth)
    dataArray.append("address", form.address)
    dataArray.append("bankName", form.bankName)
    dataArray.append("accountNumber", form.accountNumber)
    dataArray.append("acccountHolderName", form.acccountHolderName)
    dataArray.append("branch", form.branch)
    dataArray.append("ifscCode", form.ifscCode)
    dataArray.append("email", form.email)
    dataArray.append("password", form.password)
    dataArray.append("confirmPassword", form.confirmPassword)

    for (let i = 0; i < selectedFiles.length; i++) {
      dataArray.append("image", selectedFiles[i])
    }

    axios
      .post(URLS.AddAtp, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            history.push("/Promoterslist")
            sessionStorage.setItem(
              "tost",
              "Promoter has been Added Successfully"
            )
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const handlechange = e => {
    const myform = { ...form }
    myform[e.target.name] = e.target.value
    setform(myform)
  }

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setselectedFiles(files)
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Whatnot" breadcrumbItem="Edit Promoter" />
          <Form
            onSubmit={e => {
              handleSubmit(e)
            }}
          >
            <Row>
              <Col xl="12">
                <Button
                  onClick={history.goBack}
                  className="mb-3"
                  style={{ float: "right" }}
                  color="primary"
                >
                  <i className="far fa-arrow-alt-circle-left"></i>
                  Back
                </Button>
              </Col>
            </Row>

            <Card>
              <CardBody>
                <Row className="mt-2">
                  <Col lg="6">
                    <h5
                      className="mb-4"
                      style={{ color: "#000", fontWeight: "bold" }}
                    >
                      General Information
                    </h5>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Name"
                        required
                        pattern="^[a-zA-Z ]*$"
                        value={form.name}
                        name="name"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Phone <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Phone"
                        required
                        minLength="10"
                        maxLength="10"
                        pattern="[0-9]+"
                        value={form.phone}
                        name="phone"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <Label for="basicpill-firstname-input3">
                        Select Gender <span className="text-danger">*</span>
                      </Label>

                      <select
                        className="form-select"
                        required
                        value={form.selectGender}
                        name="selectGender"
                        onChange={e => {
                          handlechange(e)
                        }}
                      >
                        <option value=""> Select </option>
                        <option value="Male"> Male </option>
                        <option value="Female"> Female </option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Date Of Birth<span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="date"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Date Of Birth"
                        required
                        value={form.dateOfBirth}
                        name="dateOfBirth"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>

                  <Col lg="6">
                    <div className="text-center m-4">
                      <h5 style={{ fontWeight: "bold" }}>Profile</h5>

                      <div className="w-50 m-auto">
                        <Dropzone
                          onDrop={acceptedFiles => {
                            handleAcceptedFiles(acceptedFiles)
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick mt-2"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <div className="mb-3">
                                  <i className="display-4 text-muted bx bxs-cloud-upload" />
                                </div>
                                <h4>upload File</h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>

                        <div
                          className="dropzone-previews mt-3"
                          id="file-previews"
                        >
                          {selectedFiles.map((f, i) => {
                            return (
                              <Card
                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                key={i + "-file"}
                              >
                                <div className="p-2">
                                  <Row className="align-items-center">
                                    <Col className="col-auto">
                                      <img
                                        data-dz-thumbnail=""
                                        height="40"
                                        className="avatar-sm rounded bg-light"
                                        alt={f.name}
                                        src={f.preview}
                                      />
                                    </Col>
                                    <Col>
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
                                        {f.name}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>{f.formattedSize}</strong>
                                      </p>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Age<span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Age"
                        required
                        pattern="^[0-9]+$"
                        maxLength="3"
                        value={form.age}
                        name="age"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Id Number<span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Id Number"
                        required
                        value={form.idnumber}
                        name="idnumber"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Store Name<span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Store Name"
                        required
                        value={form.storename}
                        name="storename"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Address <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        type="text"
                        rows="3"
                        className="form-control "
                        id="basicpill-firstname-input1"
                        placeholder="Enter Address"
                        required
                        value={form.address}
                        name="address"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>{" "}
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <h5
                      className="mb-2"
                      style={{ color: "#000", fontWeight: "bold" }}
                    >
                      Bank Details
                    </h5>
                    <Row className="mt-3">
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Bank Name<span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Bank Name"
                            required
                            pattern="^[a-zA-Z ]*$"
                            value={form.bankName}
                            name="bankName"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Account Holder Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Account Holder Name"
                            required
                            pattern="^[a-zA-Z ]*$"
                            value={form.acccountHolderName}
                            name="acccountHolderName"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Account Number
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Account Number"
                            required
                            type="text"
                            minLength="12"
                            maxLength="16"
                            pattern="[0-9]+"
                            value={form.accountNumber}
                            name="accountNumber"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Branch<span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Branch"
                            required
                            pattern="^[a-zA-Z ]*$"
                            value={form.branch}
                            name="branch"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-2">
                          <Label for="basicpill-firstname-input1">
                            IFSC code
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter IFSC code"
                            required
                            value={form.ifscCode}
                            pattern="^[A-Z]{4}0\d{6}$"
                            name="ifscCode"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>{" "}
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h5
                      className=""
                      style={{ color: "#000", fontWeight: "bold" }}
                    >
                      Account Information
                    </h5>
                    <Row>
                      {" "}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Email<span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="email"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Email"
                            required
                            value={form.email}
                            name="email"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-2">
                          <Label for="basicpill-firstname-input1">
                            Password<span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Password"
                            required
                            value={form.password}
                            name="password"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-4">
                          <Label for="basicpill-firstname-input1">
                            Confirm Password
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Confirm Password"
                            required
                            value={form.confirmPassword}
                            name="confirmPassword"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Row>
                  <Col md={12}>
                    <div className=" mb-2" style={{ float: "right" }}>
                      <button
                        type="submit"
                        style={{ width: "120px" }}
                        className="btn btn-primary m-1"
                      >
                        Submit <i className="fas fa-check-circle"></i>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default AddPromoter

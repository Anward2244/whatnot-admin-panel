import PropTypes from "prop-types"
import React, { useState } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Input,
  Label,
  Form,
} from "reactstrap"
import { withRouter, Link, useHistory } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { addData } from "Servicescalls"

const ForgetPasswordPage = () => {
  const history = useHistory()

  const [form, setform] = useState([])
  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  // Add function

  const handleSubmit = async e => {
    e.preventDefault()
    // const bodydata = {
    //   email: form.email,
    // }
    // try {
    //   const resonse = await addData("doctorauth/sendotp", bodydata)
    //   var _data = resonse
    //   console.log(_data)
    //   toast.success(_data.data.message)
    //   sessionStorage.setItem("forgotemail", form.email)
    //   history.push("/otp")
    // } catch (error) {
    //   if (
    //     error.response &&
    //     error.response.data &&
    //     error.response.data.message
    //   ) {
    //     toast.error(error.response.data.message)
    //   } else {
    //   }
    // }
  }

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-softbg-soft-primary">
                  <Row>
                    <Col xs={6}>
                      <div className="text-white p-4 mt-2">
                        <h5 className="text-white">Delete Account</h5>
                      </div>
                    </Col>
                    <Col className="col-6 p-4 bg-white border border-primary">
                      <h3 className="text-primary">Whatnot</h3>
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        handleSubmit(e)
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">Name</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter Name"
                          type="text"
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Mobile</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter Number"
                          type="number"
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                          >
                            Submit
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                <p className="mb-0">
                  © {new Date().getFullYear()} What Not. Design & Develop by <a
                    href="https://whatnot.in/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Whatnot India
                  </a>
                </p>
              </div>
            </Col>
          </Row>
          <ToastContainer />
        </Container>
      </div>
    </React.Fragment>
  )
}

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
}

export default withRouter(ForgetPasswordPage)

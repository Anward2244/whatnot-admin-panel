import React, { useState, useEffect } from "react"
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
import { withRouter, Link } from "react-router-dom"
import profile from "../../assets/images/profile-img.png"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import { useHistory } from "react-router-dom"
import { URLS } from "../../Url"
import logo from "assets/images/calogo1.png"

const Resetpsw = () => {
  const [form, setform] = useState([])
  let history = useHistory()

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }
  const email = sessionStorage.getItem("email")

  const CompareOtp = () => {
    const emaildata = {
      email: email,
      newpassword: form.newpassword,
      confirmpassword: form.confirmpassword,
    }

    axios.post(URLS.Resetpass, emaildata).then(
      res => {
        if (res.status === 200) {
          toast(res.data.message)
          console.log(res.data)
          setform("")
          history.push(
            "/login",
            localStorage.setItem(
              "tost",
              "The password has been reset successfully. Please login with your new password."
            )
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

  const formsubmit = e => {
    e.preventDefault()
    CompareOtp()
  }

  const datass = () => {
    const location = localStorage.getItem("tost")
    if (location != "") {
      toast(location)
      localStorage.clear()
    } else {
      localStorage.clear()
    }
  }

  useEffect(() => {
    datass()
  }, [])

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
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}></Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img src={logo} alt="" className="rounded-circle" />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        formsubmit(e)
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">New Password</Label>
                        <Input
                          name="newpassword"
                          className="form-control"
                          placeholder="Enter New Password"
                          type="text"
                          required
                          onChange={e => {
                            handleChange(e)
                          }}
                          value={form.newpassword}
                        />
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="confirmpassword"
                          className="form-control"
                          placeholder="Enter Confirm Password"
                          type="text"
                          required
                          onChange={e => {
                            handleChange(e)
                          }}
                          value={form.confirmpassword}
                        />
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                          >
                            Reset
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to
                  <Link to="/login" className="font-weight-medium text-primary">
                    Login
                  </Link>
                </p>
                <p>
                  © {new Date().getFullYear()} Whatnot Admin.{" "}
                  <a
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
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default withRouter(Resetpsw)

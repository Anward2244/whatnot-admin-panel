import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Label,
  Form,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import ReactPaginate from "react-paginate"
import { ToastContainer, toast } from "react-toastify"
import Select from "react-select"
import { URLS } from "../../Url"
import gig from "../../assets/images/what.gif"

const Notifications = () => {
  const [form, setform] = useState({
    title: "",
    description: "",
    userList: "",
  })

  const [Noti, setNoti] = useState([])

  const [customer, setcustomer] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [titleSuggestions, setTitleSuggestions] = useState([])
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false)

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const getMentionToken = title => {
    const index = title.lastIndexOf("@")
    if (index === -1) return null

    const afterAt = title.slice(index + 1)
    if (afterAt.includes(" ")) return null

    return afterAt
  }

  const updateTitle = value => {
    const mention = getMentionToken(value)
    if (mention !== null) {
      const normalized = mention.toLowerCase()
      if (normalized === "all") {
        setform(prev => ({ ...prev, title: value, userList: "All" }))
        setselectedMulti([])
        setTitleSuggestions([])
        setShowTitleSuggestions(false)
        return
      }

      const suggestions = customer
        .filter(data => data.name && data.name.toLowerCase().includes(normalized))
        .slice(0, 5)

      setform(prev => ({ ...prev, title: value }))
      setTitleSuggestions(suggestions)
      setShowTitleSuggestions(true)
      return
    }

    setform(prev => ({ ...prev, title: value }))
    setShowTitleSuggestions(false)
    setTitleSuggestions([])
  }

  const handleTitleChange = e => {
    updateTitle(e.target.value)
  }

  const selectMentionSuggestion = option => {
    const title = form.title
    const mention = getMentionToken(title)
    if (!mention) return

    const atIndex = title.lastIndexOf("@")
    const afterAt = title.slice(atIndex + 1)
    const suffixIndex = afterAt.search(/\s/)
    const suffix = suffixIndex === -1 ? "" : afterAt.slice(suffixIndex)
    const newTitle = title.slice(0, atIndex + 1) + option.label + suffix

    setform(prev => ({ ...prev, title: newTitle, userList: "USER" }))
    setselectedMulti([option])
    setShowTitleSuggestions(false)
    setTitleSuggestions([])
  }

  const getMentionPlaceholder = title => {
    const match = title.match(/@(\S+)/)
    return match ? match[1] : null
  }

  const findCustomerByMention = mention => {
    if (!mention) return null
    const normalized = mention.toLowerCase()
    return customer.find(c => c.name && c.name.toLowerCase().includes(normalized))
  }

  const personalizeTitleForUser = (title, name) => {
    if (!name) return title
    if (/@all\b/i.test(title)) {
      return title.replace(/@all\b/gi, name)
    }
    return title.replace(/@\S+/g, name)
  }

  const getNotifications = () => {
    var token = datas
    axios
      .post(
        URLS.GetNotifications,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setNoti(res.data.notifications)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    getNotifications()
    getactivecustomers()
  }, [])

  const getactivecustomers = () => {
    var token = datas

    axios
      .post(
        URLS.GetAllPromoters,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          setcustomer(res.data.data)
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const [selectedMulti, setselectedMulti] = useState([])

  function handleMulti(data) {
    setselectedMulti(data)
  }

  const options = customer.map(data => ({
    value: data._id,
    label: data.name,
  }))

  const addnotifi = () => {
    var token = datas
    const title = form.title
    const description = form.description

    if (form.userList === "All") {
      if (/@all\b/i.test(title)) {
        if (!customer || customer.length === 0) {
          toast("No employees available to send notifications.")
          return
        }

        const requests = customer.map(user => {
          const personalizedTitle = personalizeTitleForUser(title, user.name)
          const userOption = [{ value: user._id, label: user.name }]
          return axios.post(
            URLS.AddNotifications,
            {
              title: personalizedTitle,
              userList: userOption,
              description,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        })

        Promise.all(requests)
          .then(() => {
            toast("Notification sent to all employees.")
            setIsLoading(true)
            getNotifications()
            clearForm()
            setselectedMulti([])
            setShowTitleSuggestions(false)
          })
          .catch(error => {
            if (error.response && error.response.status === 400) {
              toast(error.response.data.message)
            } else {
              toast("Failed to send notifications to all employees.")
            }
          })
        return
      }

      const dataArray = {
        title,
        userList: "All",
        description,
      }

      axios
        .post(URLS.AddNotifications, dataArray, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(
          res => {
            if (res.status === 200) {
              toast(res.data.message)
              setIsLoading(true)
              getNotifications()
              clearForm()
              setselectedMulti([])
              setShowTitleSuggestions(false)
            }
          },
          error => {
            if (error.response && error.response.status === 400) {
              toast(error.response.data.message)
            }
          }
        )
      return
    }

    let personalTitle = title
    if (selectedMulti.length === 1) {
      personalTitle = personalizeTitleForUser(title, selectedMulti[0].label)
    } else if (selectedMulti.length === 0) {
      const mention = getMentionPlaceholder(title)
      const matchedUser = findCustomerByMention(mention)
      if (matchedUser) {
        personalTitle = personalizeTitleForUser(title, matchedUser.name)
        setselectedMulti([{ value: matchedUser._id, label: matchedUser.name }])
      }
    }

    const dataArray = {
      title: personalTitle,
      userList: selectedMulti,
      description,
    }

    axios
      .post(URLS.AddNotifications, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setIsLoading(true)
            getNotifications()
            clearForm()
            setselectedMulti([])
            setShowTitleSuggestions(false)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const deletenoti = data => {
    var token = datas

    axios
      .post(
        URLS.DeleteNotifications,
        { id: data._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            getNotifications()
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
      deletenoti(data)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (form.userList === "All") {
      addnotifi()
      return
    }

    if (selectedMulti.length === 0) {
      toast("Please select at least one option.")
      return
    }

    addnotifi()
  }

  const clearForm = () => {
    setform({
      title: "",
      description: "",
      userList: "",
    })
    setShowTitleSuggestions(false)
    setTitleSuggestions([])
  }

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = Noti.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Noti.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Whatnot" breadcrumbItem="Notifications" />

          <Row>
            <Col md={4}>
              <Card className="p-4">
                <h5>Add Notification</h5>

                <Form
                  onSubmit={e => {
                    handleSubmit(e)
                  }}
                >
                  <div>
                    <div className="mt-3 position-relative">
                      <Label>Title</Label>
                      <span className="text-danger">*</span>
                      <Input
                        value={form.title}
                        onChange={handleTitleChange}
                        name="title"
                        required
                        type="text"
                        placeholder="Enter Title"
                      />
                      {showTitleSuggestions && (
                        <div
                          className="border bg-white shadow-sm"
                          style={{
                            position: "absolute",
                            zIndex: 1100,
                            width: "100%",
                            maxHeight: "220px",
                            overflowY: "auto",
                          }}
                        >
                          {titleSuggestions.length > 0 ? (
                            titleSuggestions.map(item => (
                              <div
                                key={item._id}
                                className="p-2"
                                style={{ cursor: "pointer" }}
                                onMouseDown={() => selectMentionSuggestion({ value: item._id, label: item.name })}
                              >
                                {item.name}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-muted">No matching employees found.</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <Label for="basicpill-firstname-input1">
                        Employee
                        <span className="text-danger">*</span>
                      </Label>

                      <select
                        value={form.userList}
                        name="userList"
                        onChange={e => {
                          handleChange(e)
                        }}
                        className="form-select"
                        required
                      >
                        <option value="">Select</option>
                        <option value="All">All Employee's</option>
                        <option value="USER">Single Employee</option>
                      </select>
                    </div>

                    {form.userList == "USER" ? (
                      <div className="mt-3">
                        <Label>Employee</Label>
                        <span className="text-danger">*</span>
                        <Select
                          value={selectedMulti}
                          onChange={handleMulti}
                          options={options}
                          required
                          isMulti
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="mt-3">
                      <Label>Description</Label>
                      <span className="text-danger">*</span>
                      <textarea
                        className="form-control"
                        value={form.description}
                        onChange={e => {
                          handleChange(e)
                        }}
                        name="description"
                        required
                        type="text"
                        placeholder="Description"
                      />
                    </div>
                  </div>

                  <div className="text-end mt-3">
                    <Button type="submit" color="primary">
                      Submit <i className="bx bx-check-circle"></i>
                    </Button>
                  </div>
                </Form>
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
                    <CardBody>
                      <h5> Notification List</h5>
                      <div className="table-rep-plugin mt-4 table-responsive">
                        <Table hover bordered responsive>
                          <thead>
                            <tr>
                              <th>Sl.No</th>
                              <th>Date/Time</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lists.map((data, key) => (
                              <tr key={key}>
                                <th scope="row">
                                  {(pageNumber - 1) * 5 + key + 6}
                                </th>
                                <td>
                                  {data.date} / {data.time}
                                </td>
                                <td>{data.title}</td>
                                <td>{data.description}</td>
                                <td>
                                  <Button
                                    onClick={() => {
                                      manageDelete(data)
                                    }}
                                    size="sm"
                                    className="m-1"
                                    outline
                                    color="danger"
                                  >
                                    <i
                                      style={{ fontSize: " 14px" }}
                                      className="bx bx-trash"
                                    ></i>
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
                    </CardBody>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Notifications

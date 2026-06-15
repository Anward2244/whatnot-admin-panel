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
  Modal,
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

  const [confirmModal, setConfirmModal] = useState(false)

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    if (e.target.name === "userList") {
      setselectedMulti([])
    }
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
        setform(prev => ({ ...prev, title: value, userList: prev.userList === "SELECTED_EMPLOYEES" ? "SELECTED_EMPLOYEES" : "All" }))
        if (form.userList !== "SELECTED_EMPLOYEES") {
          setselectedMulti([])
        }
        setTitleSuggestions([])
        setShowTitleSuggestions(false)
        return
      }

      if (normalized === "selected") {
        setform(prev => ({ ...prev, title: value, userList: "SELECTED_EMPLOYEES" }))
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
    if (/@(?:all|selected)\b/i.test(title)) {
      return title.replace(/@(?:all|selected)\b/gi, name)
    }

    // Escape the name to safely use it in the exact match regex
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const exactMentionRegex = new RegExp(`@${escapedName}`, "gi")
    if (exactMentionRegex.test(title)) {
      return title.replace(exactMentionRegex, name)
    }

    // Fallback for partial manual mentions without spaces (e.g. "@Kuppili")
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
    if (Array.isArray(data)) {
      setselectedMulti(data)
    } else {
      setselectedMulti(data ? [data] : [])
    }
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
      const approvedCustomers = customer.filter(c => c.kycStatus === "approved")

      if (/@all\b/i.test(title)) {
        if (!approvedCustomers || approvedCustomers.length === 0) {
          toast("No approved employees available to send notifications.")
          return
        }

        const requests = approvedCustomers.map(user => {
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
            toast("Notification sent to all approved employees.")
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
              toast("Failed to send notifications to all approved employees.")
            }
          })
        return
      }

      const allApprovedUsers = approvedCustomers.map(user => ({
        value: user._id,
        label: user.name,
      }))

      if (!allApprovedUsers || allApprovedUsers.length === 0) {
        toast("No approved employees available to send notifications.")
        return
      }

      const dataArray = {
        title,
        userList: allApprovedUsers,
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

    // If multiple selected employees and the title contains an @mention for personalization
    if (form.userList === "SELECTED_EMPLOYEES" && selectedMulti.length > 1 && /@\S+/i.test(title)) {
      const requests = selectedMulti.map(user => {
        const personalizedTitle = personalizeTitleForUser(title, user.label)
        return axios.post(
          URLS.AddNotifications,
          {
            title: personalizedTitle,
            userList: [user],
            description,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      })

      Promise.all(requests)
        .then(() => {
          toast("Notifications sent to selected employees.")
          setIsLoading(true)
          getNotifications()
          clearForm()
          setselectedMulti([])
          setShowTitleSuggestions(false)
        })
        .catch(error => {
          toast("Failed to send some personalized notifications.")
        })
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
      setConfirmModal(true)
      return
    }

    if (selectedMulti.length === 0) {
      toast("Please select at least one option.")
      return
    }

    setConfirmModal(true)
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

  const [form1, setform1] = useState({ search: "" })

  const Search = e => {
    setform1({ ...form1, [e.target.name]: e.target.value })
    setPageNumber(0)
  }

  const filteredNoti = Noti.filter(data => {
    const searchString = form1.search ? form1.search.toLowerCase() : ""
    return (
      (data.title && data.title.toLowerCase().includes(searchString)) ||
      (data.description && data.description.toLowerCase().includes(searchString)) ||
      (data.username && data.username.toLowerCase().includes(searchString)) ||
      (data.promoterName && data.promoterName.toLowerCase().includes(searchString)) ||
      (data.promoter && data.promoter.toLowerCase().includes(searchString))
    )
  })

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = filteredNoti.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(filteredNoti.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  // console.log(lists)
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Whatnot" breadcrumbItem="Notifications" />

          <Row>
            <Col md={4}>
              <Card className="p-4 shadow-sm">
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
                        placeholder="Ex: hi, @all or @name !"
                      />
                      <small className="text-muted mt-1 d-block">
                        Tip: Use @all, @selected, or @name to personalize the title.
                      </small>
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
                        <option value="SELECTED_EMPLOYEES">Selected Employees</option>
                      </select>
                    </div>

                    {form.userList === "USER" || form.userList === "SELECTED_EMPLOYEES" ? (
                      <div className="mt-3">
                        <Label>{form.userList === "USER" ? "Employee" : "Employees"}</Label>
                        <span className="text-danger">*</span>
                        <Select
                          value={form.userList === "USER" ? (selectedMulti[0] || null) : selectedMulti}
                          onChange={handleMulti}
                          options={options}
                          required
                          isMulti={form.userList === "SELECTED_EMPLOYEES"}
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
              <Card className="shadow-sm">
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
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">Notification List</h5>
                        <div style={{ width: "250px" }}>
                          <Input
                            name="search"
                            value={form1.search}
                            onChange={Search}
                            type="search"
                            placeholder="Search..."
                          />
                        </div>
                      </div>
                      <div className="table-rep-plugin mt-4 table-responsive">
                        <Table hover bordered responsive>
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Date/Time</th>
                              <th>Promoter Name</th>
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
                                <td>
                                  {data.username || data.promoterName || data.promoter || "-"}
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
        <Modal
          size="md"
          isOpen={confirmModal}
          toggle={() => {
            setConfirmModal(!confirmModal)
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Notification Preview</h5>
            <button
              onClick={() => {
                setConfirmModal(false)
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
            <div className="p-3 border rounded mb-3 bg-light shadow-sm">
              <h5 className="font-size-15 mb-2 text-primary">
                <i className="bx bx-bell me-2"></i>
                {form.title || "Notification Title"}
              </h5>
              <p className="text-muted mb-0" style={{ whiteSpace: "pre-wrap" }}>
                {form.description || "Notification description will appear here..."}
              </p>
            </div>
            <div className="mb-4">
              <strong>Target Audience: </strong>
              <span className="text-muted">
                {form.userList === "All"
                  ? "All Employee's"
                  : form.userList === "USER"
                  ? "Single Employee"
                  : "Selected Employees"}
                {form.userList !== "All" && selectedMulti.length > 0 && (
                  <span> - {selectedMulti.map(u => u.label).join(", ")}</span>
                )}
              </span>
            </div>
            <div style={{ float: "right" }}>
              <Button
                onClick={() => {
                  setConfirmModal(false)
                }}
                color="danger"
                type="button"
              >
                Cancel <i className="fas fa-times-circle"></i>
              </Button>
              <Button
                className="m-1"
                color="primary"
                onClick={() => {
                  setConfirmModal(false)
                  addnotifi()
                }}
              >
                Confirm & Send <i className="fas fa-paper-plane"></i>
              </Button>
            </div>
          </div>
        </Modal>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Notifications

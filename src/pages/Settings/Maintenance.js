import React, { useState, useEffect, useRef } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Label,
  Form,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"

const Maintenance = () => {
  const [form, setform] = useState({
    message: "",
    startTime: "",
    endTime: "",
  })

  const [currentMaintenance, setCurrentMaintenance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef(null)

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toDatetimeLocal = iso => {
    if (!iso) return ""
    const dt = new Date(iso)
    const tzOffset = dt.getTimezoneOffset() * 60000
    const local = new Date(dt - tzOffset)
    return local.toISOString().slice(0, 16)
  }

  const getSecondsUntil = endTime => {
    const now = new Date()
    const end = new Date(endTime)
    return Math.max(0, Math.floor((end - now) / 1000))
  }

  const startCountdown = seconds => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setRemainingSeconds(seconds)
    setIsRunning(true)

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          setIsRunning(false)
          stopMaintenance()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const saveMaintenance = async (setActive = null, payload = null) => {
    if (!form.message || !form.startTime || !form.endTime) {
      toast("Please fill in message, start time and end time.")
      return false
    }

    if (!payload) {
      if (!form.message || !form.startTime || !form.endTime) {
        toast("Please fill in message, start time and end time.")
        return false
      }
    }

    const data = payload || {
      message: form.message,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
    }

    setIsLoading(true)
    var token = datas
    try {
      const response = await axios.post(URLS.UpdateMaintenance, {
        isActive: setActive !== null ? setActive : currentMaintenance?.isActive || false,
        message: data.message,
        startTime: data.startTime,
        endTime: data.endTime,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast(response.data.message || "Maintenance saved")
      await getCurrentMaintenance()
      return true
    } catch (error) {
      toast(error.response?.data?.message || "Failed to save maintenance")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = e => {
    e.preventDefault()
  }

  const startMaintenance = async () => {
    if (isRunning || currentMaintenance?.isActive) return

    // First, save settings with isActive = true
    const saved = await saveMaintenance(true)
    if (!saved) return

    const now = new Date()
    const start = new Date(form.startTime)
    const end = new Date(form.endTime)

    if (now < start || now > end) {
      toast("Current time is outside the maintenance window.")
      return
    }

    const totalSeconds = Math.floor((end - now) / 1000)
    if (totalSeconds <= 0) {
      toast("Maintenance time has expired.")
      return
    }

    startCountdown(totalSeconds)
  }

  const stopMaintenance = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRunning(false)
    setRemainingSeconds(0)

    const payload = currentMaintenance ? {
      message: currentMaintenance.message,
      startTime: currentMaintenance.startTime,
      endTime: currentMaintenance.endTime,
    } : null

    if (!payload) {
      toast("No maintenance data available to stop.")
      return
    }

    await saveMaintenance(false, payload)
  }

  const getCurrentMaintenance = async () => {
    var token = datas
    try {
      const response = await axios.post(
        URLS.GetMaintenance,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = response.data.data || null
      setCurrentMaintenance(data)

      if (data) {
        setform({
          message: data.message || "",
          startTime: toDatetimeLocal(data.startTime),
          endTime: toDatetimeLocal(data.endTime),
        })

        if (data.isActive) {
          const seconds = getSecondsUntil(data.endTime)
          if (seconds > 0) {
            startCountdown(seconds)
          } else {
            setIsRunning(false)
            setRemainingSeconds(0)
          }
        }
      }
    } catch (err) {
      console.log(err)
      setCurrentMaintenance(null)
    }
  }

  useEffect(() => {
    getCurrentMaintenance()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Settings" breadcrumbItem="Maintenance" />
        <Row>
          <Col lg="8">
            <Card className="overflow-hidden">
              <CardHeader>
                <h4 className="card-title mb-0">Maintenance Settings</h4>
              </CardHeader>
              <CardBody>
                <Form onSubmit={(e) => { e.preventDefault(); saveMaintenance() }}>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          type="datetime-local"
                          name="startTime"
                          value={form.startTime}
                          onChange={handleChange}
                          disabled={isRunning}
                          required
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          type="datetime-local"
                          name="endTime"
                          value={form.endTime}
                          onChange={handleChange}
                          disabled={isRunning}
                          required
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <Label htmlFor="message">Message</Label>
                    <Input
                      type="textarea"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Enter maintenance message"
                      rows="4"
                      disabled={isRunning}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <div className="border rounded p-3 bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold">Timer</span>
                        <span className="badge bg-info text-dark">
                          {isRunning ? "Running" : "Idle"}
                        </span>
                      </div>
                      <div className="h4 mb-0">{formatTime(remainingSeconds)}</div>
                      <small className="text-muted">
                        {isRunning
                          ? "Maintenance is active"
                          : "Ready to start a new maintenance session"}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Maintenance"}
                    </Button>
                    <Button
                      type="button"
                      color="success"
                      onClick={startMaintenance}
                      disabled={isRunning || currentMaintenance?.isActive || isLoading}
                    >
                      Start Maintenance
                    </Button>
                    <Button
                      type="button"
                      color="danger"
                      onClick={stopMaintenance}
                      disabled={!currentMaintenance?.isActive || isLoading}
                    >
                      Stop Maintenance
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="overflow-hidden">
              <CardHeader>
                <h4 className="card-title mb-0">Current Maintenance Status</h4>
              </CardHeader>
              <CardBody>
                <div className="maintenance-status">
                  {currentMaintenance ? (
                    <div className="p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Status: {currentMaintenance.isActive ? "Active" : "Inactive"}</h6>
                        <span className={`badge ${currentMaintenance.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {currentMaintenance.isActive ? "Running" : "Stopped"}
                        </span>
                      </div>
                      <p className="text-muted mb-2">{currentMaintenance.message}</p>
                      <small className="text-muted d-block mb-1">
                        Start: {currentMaintenance.startTime ? new Date(currentMaintenance.startTime).toLocaleString() : "N/A"}
                      </small>
                      <small className="text-muted">
                        End: {currentMaintenance.endTime ? new Date(currentMaintenance.endTime).toLocaleString() : "N/A"}
                      </small>
                    </div>
                  ) : (
                    <p className="text-muted">No maintenance configured</p>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default Maintenance
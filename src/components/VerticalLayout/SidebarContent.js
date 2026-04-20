import PropTypes from "prop-types"
import React, { useEffect, useRef } from "react"
// //Import Scrollbar
import SimpleBar from "simplebar-react"
// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"
//i18n
import { withTranslation } from "react-i18next"

const SidebarContent = props => {
  const ref = useRef()

  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">

            <li className="menu-title">{props.t("Menu")} </li>
            <li>
              <Link to="/dashboard">
                <i className="bx bxs-grid-alt"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-group"></i>
                <span>{props.t("Employees")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/Promoterslist">{props.t("Employees List")}</Link>
                </li>
                <li>
                  <Link to="/PromoterReVerfication">
                    {props.t("Employees Re Verfication")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-layer"></i>
                <span>{props.t("Wallet Managment")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/EmployeeWallet">{props.t("Pending Request")}</Link>
                </li>
                <li>
                  <Link to="/PromoterWalletPayments">
                    {props.t("Approved Request")}
                  </Link>
                </li>
                <li>
                  <Link to="/RejectWallet">{props.t("Reject Request")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-book-open"></i>
                <span>{props.t("Products")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/Brand">{props.t("Brands")}</Link>
                </li>
                <li>
                  <Link to="/Category">{props.t("Category")}</Link>
                </li>
                <li>
                  <Link to="/Products">{props.t("Products")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-book"></i>
                <span>{props.t("Sales")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/Sales">{props.t("Sales")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-receipt"></i>
                <span>{props.t("Reports")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/SalesReport">{props.t("Sales Report")}</Link>
                </li>
                <li>
                  <Link to="/PaymentsReport">{props.t("Payments Report")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/Banners">
                <i className="bx bxs-image"></i>
                <span>{props.t("Banners")}</span>
              </Link>
            </li>

            <li>
              <Link to="/Notification">
                <i className="fa fa-bell"></i>
                <span>{props.t("Notifications")}</span>
              </Link>
            </li>

            {/* <li>
              <Link to="/Chat">
                <i className="fas fa-comment-dots"></i>
                <span>{props.t("Chat")}</span>
              </Link>
            </li> */}

            <li>
              <Link to="/#" className="has-arrow">
                <i className="fas fa-cogs"></i>
                <span>{props.t("Settings")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/Contact">{props.t("Contact Us")}</Link>
                </li>
                <li>
                  <Link to="/Maintenance">{props.t("Maintenance")}</Link>
                </li>
                <li>
                  <Link to="/FeedBack">{props.t("FeedBack")}</Link>
                </li>
                <li>
                  <Link to="/Faqs">{props.t("Faqs")}</Link>
                </li>
                <li>
                  <Link to="/PrivacyPolicy">{props.t("Privacy Policy")}</Link>
                </li>
                <li>
                  <Link to="/Terms">{props.t("Terms & Conditions")}</Link>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))

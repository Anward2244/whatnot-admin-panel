import React from "react"
import { Redirect } from "react-router-dom"
// Profile
import UserProfile from "../pages/Authentication/user-profile"
// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import Otp from "pages/Authentication/Otp"
import Setpwd from "pages/Authentication/Setpwd"

// Dashboard
import Dashboard from "../pages/Dashboard/index"

// Promoter
import AddPromoter from "pages/Salesman/AddPromoter"
import Promoterslist from "pages/Salesman/Promoterslist"
import EditPromoter from "pages/Salesman/EditPromoter"
import ViewPromoter from "pages/Salesman/ViewPromoter"

//Settings
import Terms from "pages/Settings/Terms"
import PrivacyPolicy from "pages/Settings/PrivacyPolicy"
import Faqs from "pages/Settings/Faqs"
import Contact from "pages/Settings/Contact"

//Products
import Brand from "pages/Products/Brand"
import Category from "pages/Products/Category"
import Products from "pages/Products/Products"

//Sales
import Sales from "pages/Sales/Sales"

//Reports
import SalesReport from "pages/Reports/SalesReport"
import PaymentsReport from "pages/Reports/PaymentsReport"

//Notification
import Notification from "pages/Settings/Notification"

import EmployeeWallet from "pages/Salesman/EmployeeWallet"

import SaleView from "pages/Sales/SaleView"

import PromoterWalletPayments from "pages/Salesman/PromoterWalletPayments"

import RejectWallet from "pages/Salesman/RejectWallet"

import PromoterReVerfication from "pages/Salesman/PromoterReVerfication"

import FeedBack from "pages/Settings/FeedBack"

import Banners from "pages/Settings/Banners"

import DeleteAccount from "../pages/DeleteAccount"

import Chat from "../pages/Settings/Chat"

import Maintenance from "../pages/Settings/Maintenance"

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/profile", component: UserProfile },

  { path: "/PromoterReVerfication", component: PromoterReVerfication },


  { path: "/FeedBack", component: FeedBack },

  { path: "/Banners", component: Banners },

  { path: "/RejectWallet", component: RejectWallet },

  { path: "/SaleView", component: SaleView },

  { path: "/EmployeeWallet", component: EmployeeWallet },

  { path: "/PromoterWalletPayments", component: PromoterWalletPayments },

  { path: "/AddPromoter", component: AddPromoter },
  { path: "/Promoterslist", component: Promoterslist },
  { path: "/EditPromoter", component: EditPromoter },
  { path: "/ViewPromoter", component: ViewPromoter },

  { path: "/Notification", component: Notification },

  { path: "/Terms", component: Terms },
  { path: "/PrivacyPolicy", component: PrivacyPolicy },
  { path: "/Faqs", component: Faqs },
  { path: "/Contact", component: Contact },

  { path: "/Maintenance", component: Maintenance },

  { path: "/Brand", component: Brand },
  { path: "/Category", component: Category },
  { path: "/Products", component: Products },

  { path: "/SalesReport", component: SalesReport },
  { path: "/PaymentsReport", component: PaymentsReport },

  { path: "/Sales", component: Sales },

  { path: "/Chat", component: Chat },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/login" /> },
]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
  { path: "/otp", component: Otp },
  { path: "/setpassword", component: Setpwd },
  { path: "/deleteAccount", component: DeleteAccount },
]

export { publicRoutes, authProtectedRoutes }

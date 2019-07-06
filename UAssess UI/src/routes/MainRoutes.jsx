import Dashboard from "../views/Dashboard/Index";
import CreateQuestions from "../views/CreateQuestions/Index";
import Manage from "../views/Manage/Index";
import AddNewUser from "../views/AddNewUser/Index";
import Settings from "../views/Settings/Index";
import SignOut from "../views/Authentication/SignOut";

const MainRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "fa fa-dashboard",
    page: "Dashboard",
    component: Dashboard
  },
  {
    path: "/createquestions",
    name: "Create Questions",
    icon: "fa fa-edit",
    page: "Create Questions",
    component: CreateQuestions
  },
  {
    path: "/manage",
    name: "Manage",
    icon: "fa fa-gears",
    page: "Manage",
    component: Manage
  },
  {
    path: "/addnewuser",
    name: "Add New User",
    icon: "fa fa-user-plus",
    page: "Add New User",
    component: AddNewUser
  },
  {
    path: "/settings",
    name: "Modify Settings",
    icon: "fa fa-gear",
    page: "Modify Settings",
    component: Settings
  },
  {
    path: "/signout",
    name: "Sign Out",
    page: "",
    icon: "fa fa-power-off",
    component: SignOut
  },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default MainRoutes;

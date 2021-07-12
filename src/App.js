import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//Context
import { AuthContext } from "./shared/context/auth-context";

//Routes
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Students from "./student/pages/AllStudent.page";
import Student from "./student/pages/Student.page";
import Faculty from "./faculty/pages/Faculty.page";
import AuthLogin from "./auth/pages/AuthLogin.page";
import AuthSignup from "./auth/pages/AuthSignup.page";
import Attendence from "./shared/attendence/Attendence";
import NewStudent from "./student/pages/AddNewStudent.page";
import MarkAttendence from "./shared/attendence/MarkAttendence";
import UpdateStudent from "./student/pages/UpdateStudent";
import UpdateFaculty from "./faculty/pages/UpdateFaculty";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId, isFaculty, standard } = useAuth();
  let routes;
  if (!token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <AuthLogin />
        </Route>
        <Route path="/signup" exact>
          <AuthSignup />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    if (isFaculty) {
      routes = (
        <Switch>
          {/* <Route path="/" exact>
          <Faculty />
        </Route> */}
          <Route path="/" exact>
            <Faculty />
          </Route>
          <Route path="/update-faculty/:fid" exact>
            <UpdateFaculty />
          </Route>
          <Route path="/students" exact>
            <Students />
          </Route>
          <Route path="/student/new" exact>
            <NewStudent />
          </Route>

          <Route path="/update-student/:sid" exact>
            <UpdateStudent />
          </Route>
          <Route path="/attendence/:sid" exact>
            <Attendence />
          </Route>
          <Route path="/mark-attendence" exact>
            <MarkAttendence />
          </Route>

          <Redirect to="/" />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route path="/" exact>
            <Student />
          </Route>

          <Route path="/attendence/:sid" exact>
            <Attendence />
          </Route>

          <Redirect to="/" />
        </Switch>
      );
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        login: login,
        logout: logout,
        userId: userId,
        isFaculty: isFaculty,
        standard: standard,
      }}
    >
      <Router>
        <MainNavigation />

        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

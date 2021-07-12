import React, { useContext, useState, useEffect } from "react";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";

import "./Student.css";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Student = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [studentData, setStudentData] = useState();
  const userId = auth.userId;
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/students/${userId}`
        );
        setStudentData(data.student);
      } catch (error) {}
    };
    fetchFaculty();
  }, [sendRequest, userId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverLay />
        </div>
      )}
      {!isLoading && studentData && (
        <div className="student-item">
          <Card className="student-item__content">
            <div className="student-item__image">
              <div className="student-item__heading center">
                <h1>Student</h1>
              </div>
              <Avatar
                image={`http://localhost:5000/${studentData.image}`}
                alt={studentData.name}
              />
            </div>
            <div className="vl"></div>
            <div className="student-item__details">
              <h2>Name: {studentData.name}</h2>
              <h3>Email: {studentData.email}</h3>
              <h3>Class: {studentData.standard} </h3>
            </div>
            <div className="student-item__actions">
              <Button inverse to={`/attendence/${userId}`}>
                VIEW ATTENDENCE
              </Button>
            </div>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};
export default Student;

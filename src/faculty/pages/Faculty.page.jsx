import React, { useContext, useEffect, useState } from "react";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";

import "./Faculty.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import Modal from "../../shared/components/UIElements/Modal";

const Faculty = () => {
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [facultyData, setFacultyData] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const userId = auth.userId;
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/faculty/${userId}`
        );
        setFacultyData(data.faculty);
      } catch (error) {}
    };
    fetchFaculty();
  }, [sendRequest, userId]);
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/faculty/${userId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      auth.logout();
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      {!isLoading && facultyData && (
        <div className="faculty-item">
          <Card className="faculty-item__content">
            <div className="faculty-item__heading center">
              <h1>Faculty</h1>
            </div>
            <div className="faculty-item__image">
              <Avatar
                image={`http://localhost:5000/${facultyData.image}`}
                alt={facultyData.name}
              />
            </div>
            <div className="vl"></div>

            <div className="faculty-item__details">
              <h2>Name: {facultyData.name}</h2>
              <h3>Email: {facultyData.email}</h3>
              <h3>Class: {facultyData.standard}</h3>
            </div>
            <div className="faculty-item__actions">
              <Button inverse to="/students">
                VIEW STUDENTS
              </Button>

              <Button inverse to={`/mark-attendence/`}>
                MARK ATTENDENCE
              </Button>
              <Button inverse to={`/update-faculty/${userId}`}>
                EDIT PROFILE
              </Button>

              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            </div>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};
export default Faculty;

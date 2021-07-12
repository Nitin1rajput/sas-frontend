import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AttendenceItem from "./components/AttendenceItem";
import { useHttpClient } from "../hooks/http-hook";

import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import Card from "../components/UIElements/Card";
import Button from "../components/FormElements/Button";
import Modal from "../components/UIElements/Modal";
import { AuthContext } from "../context/auth-context";

const Attendence = () => {
  const auth = useContext(AuthContext);
  const sid = useParams().sid;
  const [studentAttendence, setStudentAttendence] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchAttendence = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/attendence/${sid}`
        );
        setStudentAttendence(data.attendence);
      } catch (error) {}
    };
    fetchAttendence();
  }, [sendRequest, sid]);
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const placeDeleteHandler = () => {
    setStudentAttendence();
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/attendence/${sid}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      placeDeleteHandler();
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverLay />
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
      <Card className="center">
        <Button danger onClick={showDeleteWarningHandler}>
          DELETE
        </Button>
      </Card>
      {!isLoading && studentAttendence && (
        <AttendenceItem studentId={sid} attendence={studentAttendence} />
      )}
      {!isLoading && !studentAttendence && (
        <div className="place-list center">
          <Card>
            <h2>No attendence found</h2>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};
export default Attendence;

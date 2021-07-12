import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";

import "./StudentItem.css";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Modal from "../../shared/components/UIElements/Modal";
const StudentItem = (props) => {
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTrainModal, setShowTrainModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const showTrainWarningHandler = () => {
    setShowTrainModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const cancelTrainHandler = () => {
    setShowTrainModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    console.log("Deleted");
    try {
      await sendRequest(
        `http://localhost:5000/api/students/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };
  const confirmTrainHandler = async () => {
    setShowTrainModal(false);
    console.log("Training");
    try {
      const data = await sendRequest(
        `http://localhost:5000/api/train`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      console.log(data);
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
      <Modal
        show={showTrainModal}
        onCancel={cancelTrainHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelTrainHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmTrainHandler}>
              TRAIN
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and train the MODEL? Please note that it takes
          too much time and can't be undone thereafter.
        </p>
      </Modal>

      {!isLoading && (
        <li className="user-item">
          <Card className="user-item__content">
            <div className="item">
              {isLoading && <LoadingSpinner asOverLay />}
              <div className="user-item__image">
                <Avatar
                  image={`http://localhost:5000/${props.image}`}
                  alt={props.name}
                />
              </div>
              <div className="user-item__info">
                <h2>Name: {props.name}</h2>
                <p>Class: {props.standard}</p>
                <p>Email: {props.email}</p>
              </div>
              <div className="user-item__actions">
                <Button inverse to={`/attendence/${props.id}`}>
                  VIEW ATTENDENCE
                </Button>

                {auth.isFaculty && (
                  <Button inverse to={`/update-student/${props.id}`}>
                    EDIT PROFILE
                  </Button>
                )}
                {auth.isFaculty && (
                  <Button inverse onClick={showTrainWarningHandler}>
                    TRAIN MODEL
                  </Button>
                )}

                {auth.isFaculty && (
                  <Button danger onClick={showDeleteWarningHandler}>
                    DELETE
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </li>
      )}
    </React.Fragment>
  );
};
export default StudentItem;

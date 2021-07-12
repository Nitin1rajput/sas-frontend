import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import StudentList from "../components/StudentsList";

const ALLStudents = () => {
  const [loadedStudents, setLoadedStudents] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await sendRequest("http://localhost:5000/api/students");

        setLoadedStudents(data.students);
      } catch (error) {}
    };
    fetchUsers();
  }, [sendRequest]);
  const studentDeleteHandler = (deletedStudentId) => {
    setLoadedStudents((pervStudent) =>
      pervStudent.filter((student) => student.id !== deletedStudentId)
    );
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverLay />
        </div>
      )}
      {!isLoading && loadedStudents && (
        <StudentList
          items={loadedStudents}
          onDeleteStudent={studentDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};
export default ALLStudents;

import React from "react";

import StudentItem from "./StudentItem";
import Card from "../../shared/components/UIElements/Card";
import "./StudentList.css";
const StudentList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Students found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((s) => (
        <StudentItem
          key={s.id}
          id={s.id}
          isFaculty={s.isFaculty}
          image={s.image}
          name={s.name}
          email={s.email}
          standard={s.standard}
          attendence={s.attendence}
          onDelete={props.onDeleteStudent}
        />
      ))}
    </ul>
  );
};

export default StudentList;

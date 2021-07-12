import React from "react";
import Input from "../FormElements/Input";
import "./CheckboxInput.style.css";
const SUBJECTS = [
  "hindi",
  "english",
  "maths",
  "science",
  "sst",
  "computer",
  "physical",
];

const CheckboxInput = (props) => {
  return (
    <div className="checkbox">
      {SUBJECTS.map((sub) => {
        return (
          <div className="box">
            {/* <input id={sub} name={sub} type="checkbox" value={sub} />
            <label for={sub}>{sub.toUpperCase()}</label> */}
            <Input
              element="input"
              id={sub}
              name={sub}
              type="checkbox"
              value={sub}
              label={sub.toUpperCase()}
              onInput={props.onInput}
              validators={[]}
            />
          </div>
        );
      })}
    </div>
  );
};
export default CheckboxInput;

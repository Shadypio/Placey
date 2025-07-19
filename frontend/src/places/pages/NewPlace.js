import React, { useCallback, useReducer } from "react";
import "./NewPlace.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      console.log(
        "Reducer input change:",
        action.inputId,
        action.value,
        action.isValid,
      );
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    default:
      return state;
  }
};

const NewPlace = () => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    isValid: false,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    console.log("Input changed:", id, value, isValid);
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    if (!formState.isValid) {
      return;
    }
    console.log("Form submitted:", formState.inputs);
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        validators={[VALIDATOR_REQUIRE()]}
        id="title"
        label="Title"
        placeholder="Enter place title"
        errorText="Please enter a valid title."
        element="input"
        onInput={inputHandler}
      />
      <Input
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        id="description"
        label="Description"
        placeholder="Enter place description (5 characters minimum)"
        errorText="Please enter a valid description (at least 5 characters)."
        element="textarea"
        onInput={inputHandler}
      />
      <Input
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        id="address"
        label="Address"
        placeholder="Enter address"
        errorText="Please enter a valid address."
        element="textarea"
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;

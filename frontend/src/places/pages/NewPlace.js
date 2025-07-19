import React, { useCallback, useReducer } from "react";
import "./PlaceForm.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

const NewPlace = () => {
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false,
  );

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    if (!formState.isValid) {
      return;
    }
    console.log(formState.inputs); // Form submission logic here
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

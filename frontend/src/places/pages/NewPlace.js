import React, { useCallback, useReducer, useContext } from "react";
import "./PlaceForm.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom";

const NewPlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
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

  const history = useHistory();
  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formState.isValid) {
      return;
    }
    try {
      await sendRequest("/places", "POST", {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
        creator: auth.userId,
      });
      history.push(`/${auth.userId}/places`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
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
    </>
  );
};

export default NewPlace;

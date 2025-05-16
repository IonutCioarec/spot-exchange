import { Fragment } from "react/jsx-runtime";
import { StateLoader } from "./StateLoader";
import { UserStateLoader } from "./UserStateLoader";
import { AuthStateLoader } from "./AuthStateLoader";

export const DataLoader = () => {
  return (
    <Fragment>
      <AuthStateLoader />
      <StateLoader />
      <UserStateLoader />
    </Fragment>
  );
}
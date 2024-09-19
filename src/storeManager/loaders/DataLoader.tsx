import { Fragment } from "react/jsx-runtime";
import { StateLoader } from "./StateLoader";
import { UserStateLoader } from "./UserStateLoader";

export const DataLoader = () => {
  return (
    <Fragment>
      <StateLoader />
      <UserStateLoader />
    </Fragment>
  );
}
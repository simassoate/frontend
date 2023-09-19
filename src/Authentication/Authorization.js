// Create a custom hook for route-based authorization
import { useContext } from "react";
import { UserContext } from "UserContext";

const useAuthorization = (permissionsRequired) => {
  const { user } = useContext(UserContext);
  const { rolePermission } = user; // get the user's rolePermission

  // Parse the JSON rolePermission string to an object
  const userPermissions = JSON.parse(rolePermission);

  // Check if the user has the required permissions
  const hasRequiredPermissions =
    userPermissions && userPermissions[permissionsRequired] === "1";

  return hasRequiredPermissions;
};

export default useAuthorization;

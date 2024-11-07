import { useLoaderData, useNavigate } from "react-router-dom";
import { getUser } from "../../api/apiUsers";

function User() {
  const { user } = useLoaderData();

  return (
    <div className="user">
        <p>Users name is {user.name}.</p>
    </div>
  );
}

export async function loader() {
  const user = await getUser("45c4b990-4a01-46aa-87a5-f73e243c338c");
  return { user };
}

export default User;

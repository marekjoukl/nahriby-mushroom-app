/**
 * Project: ITU - Mushroom app
 * Author: Marek Joukl (xjoukl00)
 * Date: 15.12. 2024
 */

import { useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong :(</h1>
      <p>{error.data || error.message}</p>
    </div>
  );
}

export default Error;

import ReactDOM from "react-dom";

import App from "./App";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev/index.js";

ReactDOM.render(<DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
>
    <App/>
</DevSupport>, document.getElementById("app"));

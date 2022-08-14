import React, { useState } from "react";
import "./app.css";
import workspaces from "./components/file-explorer/example-data.json";
import Index from "./components/file-explorer";
import { TreeData } from "@atlaskit/tree";

function App() {
  const [workspaceName, setWorkspaceName] = useState<string>("workspace-1");
  const [activeWorkspace, setActiveWorkspace] = useState<TreeData>(
    workspaces["workspace-1"]
  );

  return (
    <div className="App Container">
      {/*<div className="grid-item-1"></div>*/}
      {/*<div className="grid-item-2"></div>*/}
      {/*<div className="grid-item-3"></div>*/}
      {/*<div className="grid-item-4"></div>*/}
      {/*<div className="grid-item-5"></div>*/}
      <h1>Test tree</h1>
      <Index workspace={activeWorkspace} workspaceName={workspaceName} />
    </div>
  );
}

export default App;

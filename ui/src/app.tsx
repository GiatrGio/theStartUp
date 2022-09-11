import React, { useEffect, useState } from "react";
import "./app.css";
import workspaces from "./components/fileExplorer/example-data.json";
import Index from "./components/fileExplorer";
import { TreeData } from "@atlaskit/tree";

export type DialogFileData = {
  /**
   * Did user cancel dialog?
   */
  cancelled: boolean;
  /**
   * Array of file paths that user selected
   */
  filePaths: string[];
};
function App() {
  // const [path, setPath] = useState(app.getAppPath());
  const [newW, setNewW] = useState("");
  const [workspaceName, setWorkspaceName] = useState<string>("workspace-1");
  const [activeWorkspace, setActiveWorkspace] = useState<TreeData>(
    workspaces["workspace-1"]
  );

  const openNewWorkspace = async () => {
    const newWorkspace = await window.electron.openNewWorkspace();
    setActiveWorkspace(newWorkspace);
    setWorkspaceName(newWorkspace.rootId);
  };

  return (
    <div className="App Container">
      <button onClick={() => openNewWorkspace()}>New workspace</button>
      {/*<div className="grid-item-1"></div>*/}
      {/*<div className="grid-item-2"></div>*/}
      {/*<div className="grid-item-3"></div>*/}
      {/*<div className="grid-item-4"></div>*/}
      {/*<div className="grid-item-5"></div>*/}
      <h1>{workspaceName}</h1>
      <Index workspace={activeWorkspace} workspaceName={workspaceName} />
    </div>
  );
}

export default App;

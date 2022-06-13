import React, { useState } from "react";
import './App.css';
import workspaces from "./components/multiTree/example-data.json"
import MultiTreeIndex from "./components/multiTree/MultiTreeIndex";
import { TreeData } from '@atlaskit/tree';

function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<TreeData>(workspaces["workspace-1"]);

  return (
    <div className="App">
        <h1>Test tree</h1>
      <MultiTreeIndex activeWorkspace={activeWorkspace}/>
    </div>
  );
}

export default App;

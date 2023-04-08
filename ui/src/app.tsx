import React, { useEffect, useState } from "react";
import "./app.css";
import workspaces from "./components/fileExplorer/example-data.json";
import { TreeData } from "@atlaskit/tree";
import { Login } from "./components/loginPage/login";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, State } from "./state";
import Index from "./components/fileExplorer";
import { MainPanel } from "./components/mainPanel/mainPanel";
import { Header } from "./components/header/header";

function App() {
  const dispatch = useDispatch();

  const { depositMoney, withdrawMoney, bankrupt } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const { loginUser, logoutUser, signupUser } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const amount = useSelector((state: State) => state.bank);
  const currentUser = useSelector((state: State) => state.user);

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
      <div className="grid-item header">
        <Header />
      </div>
      <div className="grid-item file-manager">
        <button onClick={() => openNewWorkspace()}>New workspace</button>
        <Index workspace={activeWorkspace} workspaceName={workspaceName} />
      </div>
      <div className="grid-item main-panel">
        <MainPanel />
        <Login />
      </div>
      <div className="grid-item footer"></div>

      <button onClick={() => depositMoney(1000)}>Deposit</button>
      <button onClick={() => withdrawMoney(1000)}>Withdraw</button>
      <button onClick={() => bankrupt()}>Bankrupt</button>
    </div>
  );
}

export default App;

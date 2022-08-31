const fs = require("fs");

const createWorkspace = (selectedDirectory) => {
  const workspaceName = getFileNameFromPath(selectedDirectory);
  let workspace = initiateNewWorkspace(workspaceName);
  addFolderItemsInWorkspace(selectedDirectory, workspace);
  return workspace;
};

const addFolderItemsInWorkspace = (parentDirectory, workspace) => {
  fs.readdirSync(parentDirectory).map((file) => {
    if (!/^\..*/.test(file)) {
      let fullFilePath = "";
      fullFilePath = fullFilePath.concat(parentDirectory, "/", file);
      const itemStats = fs.statSync(fullFilePath);
      let itemName = file;
      let isFileDirectory = itemStats.isDirectory();
      if (isFileDirectory) {
        let parentName = getFileNameFromPath(parentDirectory);
        addItemInWorkspace(parentName, itemName, itemStats, workspace);
        addFolderItemsInWorkspace(fullFilePath, workspace);
      } else {
        let parentName = parentDirectory.split("/").pop();

        // @ts-ignore
        addItemInWorkspace(parentName, itemName, itemStats, workspace);
      }
    }
  });
};

const initiateNewWorkspace = (workspaceName) => {
  let newWorkspace = {
    rootId: workspaceName,
    items: {},
  };
  newWorkspace.items[workspaceName] = {
    id: workspaceName,
    hasChildren: true,
    isExpanded: false,
    isChildrenLoading: false,
    data: {
      id: workspaceName,
      type: "WORKSPACE",
      name: workspaceName,
      QCReportUrl: "",
      size: "",
      selected: false,
    },
    children: [],
  };

  return newWorkspace;
};
const addItemInWorkspace = (parentName, itemName, itemStats, newWorkspace) => {
  const itemType = itemStats.isDirectory() ? "FOLDER" : getFileType(itemName);
  const itemSize = itemStats.isFile() ? formatSize(itemStats.size ?? 0) : "";

  newWorkspace.items[itemName] = {
    id: itemName,
    hasChildren: false,
    isExpanded: false,
    isChildrenLoading: false,
    data: {
      id: itemName,
      type: itemType,
      name: itemName,
      QCReportUrl: "",
      size: itemSize,
      selected: false,
    },
    children: [],
  };

  newWorkspace.items[parentName].children.push(itemName);

  return newWorkspace;
};
const getFileType = (itemName) => {
  const itemEnding = itemName.split(".").pop();
  switch (itemEnding) {
    case "fastq":
    case "fq":
      return "FASTQ";
    case "fasta":
    case "fa":
      return "FASTA";
    case "bam":
      return "BAM";
    case "vcf":
      return "VCF";
    case "gff":
      return "GFF";
  }
  return "UNKNOWN";
};
const formatSize = (size) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    Number((size / Math.pow(1024, i)).toFixed(2)) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
};

//TODO Probably needs to be adjusted for different operating systems.
const getFileNameFromPath = (filePath) => {
  const fileName = filePath.split("/").pop()?.split(".")[0];

  if (fileName !== undefined) {
    return fileName;
  } else {
    return "unknown file";
  }
};

exports.createWorkspace = createWorkspace;
exports.initiateNewWorkspace = initiateNewWorkspace;
exports.addItemInWorkspace = addItemInWorkspace;
exports.getFileType = getFileType;

const fs = require("fs");

const createWorkspace = (selectedDirectory) => {
  const workspaceName = getTileNameFromPath(selectedDirectory);
  let workspace = initiateNewWorkspace(selectedDirectory, workspaceName);
  addFolderItemsInWorkspace(selectedDirectory, workspace);
  return workspace;
};

const addFolderItemsInWorkspace = (parentDirectory, workspace) => {
  fs.readdirSync(parentDirectory).map((item) => {
    if (!/^\..*/.test(item)) {
      let fullTilePath = "";
      fullTilePath = fullTilePath.concat(parentDirectory, "/", item);
      const tileStats = fs.statSync(fullTilePath);
      let tileName = item;
      let isTileDirectory = tileStats.isDirectory();
      if (isTileDirectory) {
        let parentName = getTileNameFromPath(parentDirectory);
        addTileInWorkspace(
          parentName,
          tileName,
          tileStats,
          workspace,
          fullTilePath
        );
        addFolderItemsInWorkspace(fullTilePath, workspace);
      } else {
        let parentName = parentDirectory.split("/").pop();

        // @ts-ignore
        addTileInWorkspace(
          parentName,
          tileName,
          tileStats,
          workspace,
          fullTilePath
        );
      }
    }
  });
};

const initiateNewWorkspace = (selectedDirectory, workspaceName) => {
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
      path: selectedDirectory,
    },
    children: [],
  };

  return newWorkspace;
};
const addTileInWorkspace = (
  parentName,
  itemName,
  tileStats,
  newWorkspace,
  tilePath
) => {
  const tileType = tileStats.isDirectory() ? "FOLDER" : getTileType(itemName);
  const tileSize = tileStats.isFile() ? formatSize(tileStats.size ?? 0) : "";

  newWorkspace.items[itemName] = {
    id: itemName,
    hasChildren: false,
    isExpanded: false,
    isChildrenLoading: false,
    data: {
      id: itemName,
      type: tileType,
      name: itemName,
      QCReportUrl: "",
      size: tileSize,
      selected: false,
      path: tilePath,
    },
    children: [],
  };

  newWorkspace.items[parentName].children.push(itemName);

  return newWorkspace;
};
const getTileType = (tileName) => {
  const tileEnding = tileName.split(".").pop();
  switch (tileEnding) {
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
const getTileNameFromPath = (tilePath) => {
  const tileName = tilePath.split("/").pop()?.split(".")[0];

  if (tileName !== undefined) {
    return tileName;
  } else {
    return "unknown file";
  }
};

exports.createWorkspace = createWorkspace;
exports.initiateNewWorkspace = initiateNewWorkspace;
exports.addTileInWorkspace = addTileInWorkspace;
exports.getTileType = getTileType;

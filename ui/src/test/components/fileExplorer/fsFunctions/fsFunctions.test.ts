import { TreeData } from "@atlaskit/tree";
import { itemTypes } from "../../../../interfaces/commonTypes";
import fs from "fs";
import path from "path";
const {
  createWorkspace,
  getFileType,
  initiateNewWorkspace,
  addItemInWorkspace,
} = require("../../../../../public/functions");

test("get correct itemType from itemName", () => {
  expect(getFileType("file.fastq")).toBe(itemTypes.FASTQ);
  expect(getFileType("file.fq")).toBe(itemTypes.FASTQ);
  expect(getFileType("file.fasta")).toBe(itemTypes.FASTA);
  expect(getFileType("file.fa")).toBe(itemTypes.FASTA);
  expect(getFileType("file.bam")).toBe(itemTypes.BAM);
  expect(getFileType("file.vcf")).toBe(itemTypes.VCF);
  expect(getFileType("file.gff")).toBe(itemTypes.GFF);
  expect(getFileType("file.random")).toBe(itemTypes.UNKNOWN);
});

test("add new item in workspace", () => {
  const workspaceName = "tomatoWorkspace";
  const fastaName = "tomato.fa";
  let newWorkspace = initiateNewWorkspace(workspaceName);
  const fastaPath = path.join(__dirname, "testData", "tomato.fa");
  const itemStats = fs.statSync(fastaPath);

  const actualWorkspace = addItemInWorkspace(
    workspaceName,
    fastaName,
    itemStats,
    newWorkspace
  );

  const expectedWorkspace = {
    rootId: workspaceName,
    items: {
      tomatoWorkspace: {
        id: workspaceName,
        hasChildren: true,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: workspaceName,
          type: itemTypes.WORKSPACE,
          name: workspaceName,
          QCReportUrl: "",
          size: "",
          selected: false,
        },
        children: [fastaName],
      },
      "tomato.fa": {
        id: fastaName,
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: "tomato.fa",
          type: itemTypes.FASTA,
          name: fastaName,
          QCReportUrl: "",
          size: "831 B",
          selected: false,
        },
        children: [],
      },
    },
  };

  expect(actualWorkspace).toEqual(expectedWorkspace);
});

test("Create workspace from folder", () => {
  const testWorkspacePath = path.join(__dirname, "testData");

  const actualWorkspace = createWorkspace(testWorkspacePath);

  expect(actualWorkspace).toEqual(getExpectedWorkspace());
});

const getExpectedWorkspace = (): TreeData => {
  return {
    rootId: "testData",
    items: {
      testData: {
        id: "testData",
        hasChildren: true,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: "testData",
          type: itemTypes.WORKSPACE,
          name: "testData",
          QCReportUrl: "",
          size: "",
          selected: false,
        },
        children: ["folder 1", "folder 2", "tomato.fa"],
      },
      "folder 1": {
        id: "folder 1",
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: "folder 1",
          type: itemTypes.FOLDER,
          name: "folder 1",
          QCReportUrl: "",
          size: "",
          selected: false,
        },
        children: ["inside folder", "tomato2.fa", "tomato3.fa"],
      },
      "inside folder": {
        id: "inside folder",
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: "inside folder",
          type: itemTypes.FOLDER,
          name: "inside folder",
          QCReportUrl: "",
          size: "",
          selected: false,
        },
        children: ["tomato 4.fa"],
      },
      "tomato 4.fa": {
        id: "tomato 4.fa",
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: "tomato 4.fa",
          type: itemTypes.FASTA,
          name: "tomato 4.fa",
          QCReportUrl: "",
          size: "831 B",
          selected: false,
        },
        children: [],
      },
      "tomato2.fa": {
        id: "tomato2.fa",
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: "tomato2.fa",
          type: itemTypes.FASTA,
          name: "tomato2.fa",
          QCReportUrl: "",
          size: "831 B",
          selected: false,
        },
        children: [],
      },
      "tomato3.fa": {
        id: "tomato3.fa",
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: "tomato3.fa",
          type: itemTypes.FASTA,
          name: "tomato3.fa",
          QCReportUrl: "",
          size: "831 B",
          selected: false,
        },
        children: [],
      },
      "folder 2": {
        id: "folder 2",
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: "folder 2",
          type: itemTypes.FOLDER,
          name: "folder 2",
          QCReportUrl: "",
          size: "",
          selected: false,
        },
        children: [],
      },
      "tomato.fa": {
        id: "tomato.fa",
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: "tomato.fa",
          type: itemTypes.FASTA,
          name: "tomato.fa",
          QCReportUrl: "",
          size: "831 B",
          selected: false,
        },
        children: [],
      },
    },
  };
};

test("test", () => {
  expect("1").toBe("1");
});

import * as fs from "fs";
const glob = require("glob");
import { parse } from "node-html-parser";
import config from "./config";

var finalTemplates = {} as any;

function readTemplates(basePart: string, filePart: string) {
  return fs.readFile(`sources/${basePart}/${filePart}`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // extract file formats
    const root = parse(data, { comment: true });

    // find description which are available in comments.
    var findComments = function (el: any) {
      var arr = [];
      for (var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if (node.nodeType === 8) {
          arr.push(node);
        } else {
          arr.push.apply(arr, findComments(node));
        }
      }
      return arr;
    };

    var commentNodes = findComments(root);
    const templateDesc = commentNodes[0].rawText;
    const templateCode = data.replace(/<!--[\s\S]*?-->/g, "");

    //     const template = `
    // "${basePart}" : {
    //     "prefix": "${filePart.split(".").slice(0, -1).join(".")}",
    //     "body": [
    //       ${JSON.stringify(templateCode)}
    //     ],
    //     "description": "${templateDesc}"
    // }
    // `;

    const template = {
      prefix: `${filePart.split(".").slice(0, -1).join(".")}`,
      body: [JSON.stringify(templateCode)],
      description: templateDesc,
    };

    // finalTemplates[basePart] += template;
    finalTemplates = Object.assign({ title: "check" }, finalTemplates);
  });
}
// createFreshSnippets();

var getDirectories = function (src: string, extension: string, callback: any) {
  glob(src + "/**/*" + extension, callback);
};

getDirectories("sources", "html", function (err: any, res: any) {
  if (err) {
    console.log("Error", err);
  } else {
    res.map((f: any, index: number) => {
      const parts = f.split("/");
      const basePart = parts[1];

      const filePart = parts[2] != undefined ? parts[2] : "";

      // console.log(basePart);

      // console.log("Iterating-" + index, basePart, filePart);

      // get templates from the file
      getTemplatesFromFile(basePart, filePart);
    });
  }
});

const getTemplatesFromFile = (basePart: string, filePart: string) => {
  // convert it into proper format and append it.
  readTemplates(basePart, filePart);

  setTimeout(() => {
    // write to respective files.
    writeSnippetToFile(finalTemplates, basePart);
  }, 1000);
};

const writeSnippetToFile = (finalTemplates: Object, basePart: string) => {
  const writtenFile = `./snippets/${basePart}.code-snippets`;
  if (!fs.existsSync(config.folderName)) {
    fs.mkdirSync(config.folderName);
  }

  console.log("fT", finalTemplates);

  // create file if not exist
  fs.open(writtenFile, "w", function (err, file) {
    if (err) throw err;
    console.log(file, "File created!");
  });

  fs.appendFile(writtenFile, finalTemplates.toString(), (err) => {
    if (err) {
      console.error(err);
      return;
    }

    //file written successfully
    // console.log("File written successfully");
  });
  // console.log(finalTemplates);
};

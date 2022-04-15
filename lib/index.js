"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const glob = require("glob");
const node_html_parser_1 = require("node-html-parser");
const config_1 = require("./config");
var finalTemplates = {};
function readTemplates(basePart, filePart) {
    return fs.readFile(`sources/${basePart}/${filePart}`, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        // extract file formats
        const root = (0, node_html_parser_1.parse)(data, { comment: true });
        // find description which are available in comments.
        var findComments = function (el) {
            var arr = [];
            for (var i = 0; i < el.childNodes.length; i++) {
                var node = el.childNodes[i];
                if (node.nodeType === 8) {
                    arr.push(node);
                }
                else {
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
var getDirectories = function (src, extension, callback) {
    glob(src + "/**/*" + extension, callback);
};
getDirectories("sources", "html", function (err, res) {
    if (err) {
        console.log("Error", err);
    }
    else {
        res.map((f, index) => {
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
const getTemplatesFromFile = (basePart, filePart) => {
    // convert it into proper format and append it.
    readTemplates(basePart, filePart);
    setTimeout(() => {
        // write to respective files.
        writeSnippetToFile(finalTemplates, basePart);
    }, 1000);
};
const writeSnippetToFile = (finalTemplates, basePart) => {
    const writtenFile = `./snippets/${basePart}.code-snippets`;
    if (!fs.existsSync(config_1.default.folderName)) {
        fs.mkdirSync(config_1.default.folderName);
    }
    console.log("fT", finalTemplates);
    // create file if not exist
    fs.open(writtenFile, "w", function (err, file) {
        if (err)
            throw err;
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
//# sourceMappingURL=index.js.map
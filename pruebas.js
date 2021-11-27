const printer = require('./lib/TOOLS/Printer/printer');
const fs = require('fs');





const data = require('./chrome_history.json');

//printer.printMachineLabels([84,74,45,63]);

var json2xlsx = require('node-json-xlsx');

var xlsx = json2xlsx(data,{
    fieldNames:["id",
	"title",
	"url",
	"lastVisitTimeLocal",
	"lastVisitTimeUTC",
	"typedCount",
	"visitCount"]
});

fs.writeFileSync('HistorialGloriaChrome.xlsx', xlsx, 'binary');





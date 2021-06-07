const exp  = module.exports;
const fs = require("fs");
const db = require('../TOOLS/Databases/database');
const pdf = require('pdf-creator-node');
const path = require("path");
const QRCode = require('qrcode');
const { encode } = require("querystring");
const encrypter = require("../TOOLS/Encriptador/encrypter");

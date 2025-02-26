#!/usr/bin/env node

// imports
const yargs = require("yargs");
const axios = require("axios");
const os = require("os");
const inquirer = require("inquirer");

// get public ip function
async function getPublicIp() {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    return "Can't get public IP";
  }
}

// get local ip function
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "N/A";
}

// get ip info function
async function getIpInfo(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    return "Can't get provider info";
  }
}

// print my ip info function
async function myInfo() {
  console.log("Checking your IP info...\n");

  const localIp = getLocalIp();
  console.log(`Local IP: ${localIp}\n`);

  const publicIp = await getPublicIp();
  console.log(`Public IP: ${publicIp}`);

  if (publicIp && publicIp !== "Cant get provider info") {
    const ipInfo = await getIpInfo(publicIp);
    if (typeof ipInfo === "object") {
      console.log("\nProvider/Network info:");
      console.log(`Country: ${ipInfo.country || "N/A"}`);
      console.log(`Region: ${ipInfo.regionName || "N/A"}`);
      console.log(`City: ${ipInfo.city || "N/A"}`);
      console.log(`Provider: ${ipInfo.isp || "N/A"}`);
      console.log(`Org: ${ipInfo.org || "N/A"}`);
      console.log(`AS: ${ipInfo.as || "N/A"}`);
    } else {
      console.log(ipInfo);
    }
  }
}

// print other ip info function
async function IpInfo(ip) {
  const publicIp = await getPublicIp();
  if (ip === publicIp) {
    console.log("Bro it's your IP!");
    console.log(`BTW, your local IP is: ${getLocalIp()}`);
  }

  const ipInfo = await getIpInfo(ip);
  if (typeof ipInfo === "object") {
    console.log("\nProvider/Network info:");
    console.log(`Country: ${ipInfo.country || "N/A"}`);
    console.log(`Region: ${ipInfo.regionName || "N/A"}`);
    console.log(`City: ${ipInfo.city || "N/A"}`);
    console.log(`Provider: ${ipInfo.isp || "N/A"}`);
    console.log(`Org: ${ipInfo.org || "N/A"}`);
    console.log(`AS: ${ipInfo.as || "N/A"}`);
  } else {
    console.log(ipInfo);
  }
}

// main function
async function main() {
  const argv = yargs.argv;

  // checking args
  if (argv._.includes("my")) {
    await myInfo();
  } else if (argv._.length > 0 && !isNaN(argv._[0].replace(/\./g, ""))) {
    await IpInfo(argv._[0]);
  } else if (argv._.includes("check")) {
    if (argv._.length > 1) {
      await IpInfo(argv._[1]);
    } else {
      const ipAnswer = await inquirer.prompt([
        {
          type: "input",
          name: "ip",
          message: "Enter IP address:",
        },
      ]);

      await IpInfo(ipAnswer.ip);
    }
  } else {
    // wutdepc ad btw :)
    console.log(`
  .---------------------------------------------.
  | Also try wutdepc: npmjs.com/package/wutdepc |
  | Install: npm i -g wutdepc                   |
  '---------------------------------------------'\n`);

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose an action:",
        choices: ["1. Other IP info", "2. My IP info"],
      },
    ]);

    if (answers.choice === "2. My IP info") {
      await myInfo();
    } else if (answers.choice === "1. Other IP info") {
      const ipAnswer = await inquirer.prompt([
        {
          type: "input",
          name: "ip",
          message: "Enter IP:",
        },
      ]);

      await IpInfo(ipAnswer.ip);
    }
  }
}

main().catch(console.error);

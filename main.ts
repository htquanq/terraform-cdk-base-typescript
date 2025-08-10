import { App } from "cdktf";
import { NetworkStack } from "./src/stacks/network";
import { RdsStack } from "./src/stacks/rds";
import { loadConfig } from "./src/helpers/config";

const app = new App();

// Get environment from context
const envName = app.node.getContext("environment");

// Load config
const config = loadConfig(`./config/${envName}.yaml`);
// Create stacks based on STACK_NAME env var
const stackName = process.env.STACK_NAME;
switch (stackName) {
  case "network":
    new NetworkStack(app, "VPC", config);
    break;
  case "rds":
    new RdsStack(app, "RDS", config);
    break;
}

app.synth();
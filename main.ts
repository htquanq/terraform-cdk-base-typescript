import { App, S3Backend } from "cdktf";
import { NetworkStack } from "./src/stacks/network";
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
    const networkStack = new NetworkStack(app, "VPC", config);
    new S3Backend(networkStack, {
      bucket: `${config.accountId}-terraform-states`,
      key: `${envName}/network/terraform.tfstate`,
      region: config.region
    });
    break;
}

app.synth();
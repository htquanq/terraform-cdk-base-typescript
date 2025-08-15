import { Construct } from "constructs";
import {TerraformStack, TerraformOutput, Fn } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { Vpc } from "@cdktf/provider-aws/lib/vpc";
import { Subnet } from "@cdktf/provider-aws/lib/subnet";
import { DataAwsAvailabilityZones } from "@cdktf/provider-aws/lib/data-aws-availability-zones";
import { DbSubnetGroup } from "@cdktf/provider-aws/lib/db-subnet-group";
import { AppConfig } from "../interfaces/config";

export class NetworkStack extends TerraformStack {
  constructor(scope: Construct, name: string, config: AppConfig) {
    super(scope, name);

    // Create AWS Provider
    const provider = new AwsProvider(this, "AWS", {
      region: config.region,
      profile: config.awsProfile,
    });

    // Create VPC
    const vpc = new Vpc(this, config.vpc.name, config.vpc.config);

    // Get available AZs
    const zones = new DataAwsAvailabilityZones(this, "zones", {
      provider,
      state: "available",
    });

    // Create public subnets
    config.vpc.publicSubnets.map((subnet, index) => {
      return new Subnet(this, `public-subnet-${index}`, {
        vpcId: vpc.id,
        cidrBlock: subnet.cidrBlock,
        mapPublicIpOnLaunch: true,
        availabilityZone: Fn.element(zones.names, index % Fn.lengthOf(zones.names)),
        dependsOn: [vpc],
      });
    });

    // Create private subnets
    config.vpc.privateSubnets.map((subnet, index) => {
      return new Subnet(this, `private-subnet-${index}`, {
        vpcId: vpc.id,
        cidrBlock: subnet.cidrBlock,
        availabilityZone: Fn.element(zones.names, index % Fn.lengthOf(zones.names)),
        dependsOn: [vpc],
      });
    });

    // Create DB subnets
    const dbSubnets = config.vpc.dbSubnets.map((subnet, index) => {
      const dbSubnet = new Subnet(this, `db-subnet-${index}`, {
        vpcId: vpc.id,
        cidrBlock: subnet.cidrBlock,
        availabilityZone: Fn.element(zones.names, index % Fn.lengthOf(zones.names)),
        dependsOn: [vpc],
      });

      return dbSubnet;
    });

    // Create DB subnet group
    const dbSubnetGroup = new DbSubnetGroup(this, "db-subnet", {
      name: "db-subnet",
      subnetIds: dbSubnets.map((subnet) => subnet.id),
    });

    // Create outputs
    new TerraformOutput(this, "vpc-id", {
      value: vpc.id,
    });

    new TerraformOutput(this, "vpc-arn", {
      value: vpc.arn,
    });

    new TerraformOutput(this, "db-subnet-group-name", {
      value: dbSubnetGroup.name,
    });

    new TerraformOutput(this, "db-subnet-group-arn", {
      value: dbSubnetGroup.arn,
    });
  }
}
export interface SubnetConfig {
  cidrBlock: string;
}

export interface VpcConfig {
  name: string;
  config: {
    cidrBlock: string;
    tags?: { [key: string]: string };
    tagsAll?: { [key: string]: string };
  };
  publicSubnets: SubnetConfig[];
  privateSubnets: SubnetConfig[];
  dbSubnets: SubnetConfig[];
}
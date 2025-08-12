# Terraform CDK with Typescript
This is a base stack contained core resources that other stacks can inherit from it
## Stack components
  * VPC
  * Public subnets
  * Private subnets
  * Database subnets

## Synth stack

```shell
# network is the stack name
make synth-network
```

## Deploy stack

```shell
# network is the stack name
make deploy-network
```
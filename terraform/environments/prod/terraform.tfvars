aws_region           = "us-east-1"
vpc_cidr             = "10.100.0.0/16"
public_subnet_cidrs  = ["10.100.1.0/24", "10.100.2.0/24", "10.100.3.0/24"]
private_subnet_cidrs = ["10.100.10.0/24", "10.100.20.0/24", "10.100.30.0/24"]
availability_zones   = ["us-east-1a", "us-east-1b", "us-east-1c"]
db_password          = "CHANGE_ME_IN_SECRETS_MANAGER"

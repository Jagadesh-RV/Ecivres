aws_region           = "us-east-1"
environment          = "staging"
vpc_cidr             = "10.50.0.0/16"
public_subnet_cidrs  = ["10.50.1.0/24", "10.50.2.0/24", "10.50.3.0/24"]
private_subnet_cidrs = ["10.50.10.0/24", "10.50.20.0/24", "10.50.30.0/24"]
availability_zones   = ["us-east-1a", "us-east-1b", "us-east-1c"]
db_instance_class    = "db.t4g.small"
db_password          = "CHANGE_ME_VIA_AWS_SECRETS_MANAGER"
redis_node_type      = "cache.t4g.micro"
kubernetes_version   = "1.29"


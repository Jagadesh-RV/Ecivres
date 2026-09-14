variable "environment" { type = string }
variable "subnet_ids" { type = list(string) }
variable "security_group_ids" { type = list(string) }
variable "instance_class" { type = string; default = "db.m6g.xlarge" }
variable "allocated_storage" { type = number; default = 100 }
variable "max_allocated_storage" { type = number; default = 1000 }
variable "multi_az" { type = bool; default = true }
variable "db_name" { type = string; default = "ecivres_prod" }
variable "db_username" { type = string; default = "ecivres_admin" }
variable "db_password" { type = string; sensitive = true }
variable "backup_retention_days" { type = number; default = 30 }
variable "tags" { type = map(string); default = {} }

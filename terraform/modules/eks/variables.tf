variable "environment" { type = string }
variable "kubernetes_version" { type = string; default = "1.29" }
variable "private_subnet_ids" { type = list(string) }
variable "security_group_ids" { type = list(string) }
variable "desired_node_count" { type = number; default = 3 }
variable "min_node_count" { type = number; default = 2 }
variable "max_node_count" { type = number; default = 20 }
variable "instance_types" { type = list(string); default = ["m6i.xlarge", "c6i.xlarge"] }
variable "tags" { type = map(string); default = {} }

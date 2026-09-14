variable "environment" { type = string }
variable "subnet_ids" { type = list(string) }
variable "security_group_ids" { type = list(string) }
variable "node_type" { type = string; default = "cache.r6g.large" }
variable "num_cache_nodes" { type = number; default = 2 }
variable "tags" { type = map(string); default = {} }

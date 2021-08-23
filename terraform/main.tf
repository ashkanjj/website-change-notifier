terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"

}


provider "aws" {
  profile = "default"
  region  = "eu-west-2"
}

resource "aws_dynamodb_table" "watched-urls-dynamodb-table" {
  name           = "watched-url"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "userId"
  range_key      = "sk"

  attribute {
    name = "userId"
    type = "N"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  tags = {
    Name        = "main-dynamodb-table"
    Environment = "prod"
  }
}
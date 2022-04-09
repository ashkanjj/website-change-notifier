terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"

  backend "s3" {
    bucket = "website-change-notifier-tf-state"
    key = "terraform.tfstate"
    region = "eu-west-2"
  }

}


provider "aws" {
  profile = "default"
  region  = "eu-west-2"
}

resource "aws_dynamodb_table" "watched-urls-dynamodb-table" {
  name           = "watched-url"
  billing_mode   = "PAY_PER_REQUEST"
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

  attribute {
    name = "type"
    type = "S"
  }

  global_secondary_index {
    name               = "GetAllIndex"
    hash_key           = "type"
    range_key          = "sk"
    projection_type    = "INCLUDE"
    non_key_attributes = ["createdOn"]
  }


  tags = {
    Name        = "main-dynamodb-table"
    Environment = "prod"
  }
}
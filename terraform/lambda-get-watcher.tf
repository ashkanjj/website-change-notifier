resource "aws_s3_bucket" "get_watcher_lambda_bucket" {
  bucket = "get-watcher-lambda-bucket"

  acl           = "private"
  force_destroy = true
}

data "archive_file" "get_watcher_archive_file" {
  type = "zip"

  source_dir  = "${local.src}/lambdas/get_watcher/dist"
  output_path = "${local.src}/../src/lambdas/get_watcher.zip"
}

resource "aws_s3_bucket_object" "get_watcher_lambda_bucket_object" {
  bucket = aws_s3_bucket.get_watcher_lambda_bucket.id

  key    = "get_watcher.zip"
  source = data.archive_file.get_watcher_archive_file.output_path

  etag = filemd5(data.archive_file.get_watcher_archive_file.output_path)
}

resource "aws_lambda_function" "get_watcher" {
  function_name = "GetWatcher"

  s3_bucket = aws_s3_bucket.get_watcher_lambda_bucket.id
  s3_key    = aws_s3_bucket_object.get_watcher_lambda_bucket_object.key

  runtime = "nodejs14.x"
  handler = "main.handler"

  source_code_hash = data.archive_file.get_watcher_archive_file.output_base64sha256

  role = aws_iam_role.get_watcher_lambda_exec.arn
}


resource "aws_cloudwatch_log_group" "get_watcher" {
  name = "/aws/lambda/${aws_lambda_function.get_watcher.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "get_watcher_lambda_exec" {
  name = "get_watcher_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "get_lambda_policy" {
  role       = aws_iam_role.get_watcher_lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "dynamodbWatchedUrlWriteAccess" {
  name = "dynamodbWatchedUrlWriteAccess"
  role = aws_iam_role.get_watcher_lambda_exec.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:Get*",
          "dynamodb:Query",
          "dynamodb:Scan",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:dynamodb:eu-west-2:476368154329:table/watched-url"
      },
    ]
  })
}

resource "aws_apigatewayv2_api" "get_watcher_lambda" {
  name          = "serverless_lambda_gw_get_watcher"
  protocol_type = "HTTP"
  cors_configuration {
    allow_methods = ["OPTIONS","POST"]
    allow_origins = ["*"]
    allow_headers = ["Content-Type"]
  }
}

resource "aws_apigatewayv2_stage" "get_watcher_lambda" {
  api_id = aws_apigatewayv2_api.get_watcher_lambda.id

  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.get_watcher.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "get_watcher" {
  api_id = aws_apigatewayv2_api.get_watcher_lambda.id

  integration_uri    = aws_lambda_function.get_watcher.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_watcher" {
  api_id = aws_apigatewayv2_api.get_watcher_lambda.id

  route_key = "GET /watcher"
  target    = "integrations/${aws_apigatewayv2_integration.get_watcher.id}"
}

resource "aws_apigatewayv2_route" "get_watcher_user" {
  api_id = aws_apigatewayv2_api.get_watcher_lambda.id

  route_key = "GET /watcher/{user}"
  target    = "integrations/${aws_apigatewayv2_integration.get_watcher.id}"
}


resource "aws_cloudwatch_log_group" "get_watcher_apigw" {
  name = "/aws/api_get_watcher_gw/${aws_apigatewayv2_api.get_watcher_lambda.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_get_watcher_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_watcher.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.get_watcher_lambda.execution_arn}/*/*"
}


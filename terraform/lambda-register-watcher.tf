resource "aws_s3_bucket" "register_watcher_lambda_bucket" {
  bucket = "register-watcher-lambda-bucket"

  acl           = "private"
  force_destroy = true
}

data "archive_file" "register_watcher_archive_file" {
  type = "zip"

  source_dir  = "${path.module}/lambdas/register_watcher"
  output_path = "${path.module}/register_watcher.zip"
}

resource "aws_s3_bucket_object" "register_watcher_lambda_bucket_object" {
  bucket = aws_s3_bucket.register_watcher_lambda_bucket.id

  key    = "register_watcher.zip"
  source = data.archive_file.register_watcher_archive_file.output_path

  etag = filemd5(data.archive_file.register_watcher_archive_file.output_path)
}

resource "aws_lambda_function" "register_watcher" {
  function_name = "RegisterWatcher"

  s3_bucket = aws_s3_bucket.register_watcher_lambda_bucket.id
  s3_key    = aws_s3_bucket_object.register_watcher_lambda_bucket_object.key

  runtime = "nodejs14.x"
  handler = "main.handler"

  source_code_hash = data.archive_file.register_watcher_archive_file.output_base64sha256

  role = aws_iam_role.register_watcher_lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "register_watcher" {
  name = "/aws/lambda/${aws_lambda_function.register_watcher.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "register_watcher_lambda_exec" {
  name = "register_watcher_lambda"

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

resource "aws_iam_role_policy_attachment" "register_watcher_lambda_policy" {
  role       = aws_iam_role.register_watcher_lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "dynamodbRegisterUrlWriteAccess" {
  name = "dynamodbRegisterUrlWriteAccess"
  role = aws_iam_role.register_watcher_lambda_exec.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:PutItem",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:dynamodb:eu-west-2:476368154329:table/watched-url"
      },
    ]
  })
}

resource "aws_apigatewayv2_api" "register_watcher_lambda" {
  name          = "serverless_lambda_gw_post_watcher"
  protocol_type = "HTTP"
  cors_configuration {
    allow_methods = ["OPTIONS","POST"]
    allow_origins = ["*"]
    allow_headers = ["Content-Type"]
  }
}

resource "aws_apigatewayv2_stage" "register_watcher_lambda" {
  api_id = aws_apigatewayv2_api.register_watcher_lambda.id

  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.register_watcher_apigw.arn

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

resource "aws_apigatewayv2_integration" "register_watcher" {
  api_id = aws_apigatewayv2_api.register_watcher_lambda.id

  integration_uri    = aws_lambda_function.register_watcher.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "register_watcher" {
  api_id = aws_apigatewayv2_api.register_watcher_lambda.id

  route_key = "POST /watcher"
  target    = "integrations/${aws_apigatewayv2_integration.register_watcher.id}"
}

resource "aws_cloudwatch_log_group" "register_watcher_apigw" {
  name = "/aws/api_register_watcher_gw/${aws_apigatewayv2_api.register_watcher_lambda.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_register_watcher_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register_watcher.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.register_watcher_lambda.execution_arn}/*/*"
}


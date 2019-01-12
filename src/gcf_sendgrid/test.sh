gcloud beta functions deploy sendgridEmail --stage-bucket holms-staging --trigger-http

gcloud beta functions deploy sendgridWebhook --stage-bucket holms-staging --trigger-http

gcloud beta functions deploy sendgridLoad --stage-bucket holms-staging --trigger-bucket holms-bucket

curl -k -X POST "https://us-central1-hubbell-251e4.cloudfunctions.net/sendgridEmail?sg_key=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" --data '{"to":"matthew.hubbell@outlook.com","from":"holms@gmail.com","subject":"Hello from Sendgrid!","body":"Hello World!"}' --header "Content-Type: application/json"
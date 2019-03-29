# verikai
services wrapper

This program is designed to take in data in predetermined structure and normalize that data for consumption by another API. Then the response from the external API is delivered back to the user.

If anything in this program is not up to standards or not using best practices or incorrect in some way then I would ask that you please give me a chance to revise or refactor it so that it does meet and exceed expectations.

One area of the program that I think I could improve on is the data normalization function. However, I think the code I have there now does do a good job.

I'm going to leave my console.log statements in the code for now. My current employer prefers to leave those in. I am not sure what Verikai's feelings on that are.

Lambda disk memory is non-persistent. So, both of the log files written will be destroyed shortly after execution. If you would like I can update the code to push those files to an S3 bucket. I didn't do that already because of time and not wanting to venture too far outside specifications.

I tested this with an AWS account using API Gateway and AWS Lambda.
I also tested this with 23 passing unit tests.

To execute unit tests run "npm test"
import kue from 'kue';

// Create a new queue
const queue = kue.createQueue();

// Function to send notifications
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process the jobs in the queue
queue.process('push_notification_code', (job, done) => {
  // Extract phone number and message from the job data
  const { phoneNumber, message } = job.data;

  // Call sendNotification with the job data
  sendNotification(phoneNumber, message);

  // Mark the job as done
  done();
});


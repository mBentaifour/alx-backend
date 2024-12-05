import kue from 'kue';

// Create a new queue
const queue = kue.createQueue();

// Blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send notification
function sendNotification(phoneNumber, message, job, done) {
  // Track job progress
  job.progress(0, 100);

  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job if phone number is blacklisted
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Track progress to 50%
  job.progress(50, 100);

  // Log the sending notification message
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Simulate job completion after 1 second (to represent sending notification)
  setTimeout(() => {
    job.progress(100, 100);
    done();
  }, 1000);
}

// Process the jobs
queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});

// Handle job completion, failure, and progress
queue.on('job complete', (id) => {
  console.log(`Notification job #${id} completed`);
});

queue.on('job failed', (id, err) => {
  console.log(`Notification job #${id} failed: ${err.message}`);
});

queue.on('job progress', (id, progress) => {
  console.log(`Notification job #${id} ${progress}% complete`);
});


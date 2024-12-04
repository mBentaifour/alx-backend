import kue from 'kue';

// Create a new queue
const queue = kue.createQueue();

// Create the job data object
const jobData = {
  phoneNumber: '1234567890',
  message: 'Hello from the queue!',
};

// Create a job in the push_notification_code queue
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.log('Notification job failed:', err);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// Event listener for job completion
job.on('complete', () => {
  console.log('Notification job completed');
});

// Event listener for job failure
job.on('failed', (errorMessage) => {
  console.log('Notification job failed:', errorMessage);
});


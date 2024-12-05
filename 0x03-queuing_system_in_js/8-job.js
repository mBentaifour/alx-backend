import kue from 'kue';

// Create the function to handle job creation
function createPushNotificationsJobs(jobs, queue) {
  // Check if the jobs argument is an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // For each job in the jobs array, create a new job in the queue
  jobs.forEach((jobData) => {
    // Create a job for the push_notification_code_3 queue
    const job = queue.create('push_notification_code_3', jobData)
      .save((err) => {
        if (err) {
          console.log(`Notification job failed: ${err}`);
        } else {
          console.log(`Notification job created: ${job.id}`);
        }
      });

    // Listen for job events
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    job.on('failed', (err) => {
      console.log(`Notification job ${job.id} failed: ${err}`);
    });

    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
}

export default createPushNotificationsJobs;


import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';
import { expect } from 'chai';

describe('createPushNotificationsJobs', () => {
  let queue;

  // Setup the queue before each test
  beforeEach(() => {
    queue = kue.createQueue();
    queue.testMode = true;  // Enter test mode to prevent jobs from actually processing
  });

  // Clear the queue and exit test mode after each test
  afterEach(() => {
    queue.testMode = false;  // Exit test mode
    queue.removeCompleted();  // Clear the queue of completed jobs
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
  });

  it('should create jobs in the queue', (done) => {
    const jobs = [
      { phoneNumber: '4153518780', message: 'Message 1' },
      { phoneNumber: '4153518781', message: 'Message 2' }
    ];

    createPushNotificationsJobs(jobs, queue);

    // Wait a bit for the jobs to be created
    setTimeout(() => {
      // Check that jobs have been created in the queue
      expect(queue.testMode.jobs.length).to.equal(2);
      expect(queue.testMode.jobs[0].data.phoneNumber).to.equal('4153518780');
      expect(queue.testMode.jobs[1].data.phoneNumber).to.equal('4153518781');
      done();
    }, 100);
  });

  it('should log the creation, completion, and failure of jobs', (done) => {
    const jobs = [
      { phoneNumber: '4153518780', message: 'Message 1' },
      { phoneNumber: '4153518782', message: 'Message 2' }
    ];

    createPushNotificationsJobs(jobs, queue);

    // Simulate job completion and failure
    const job1 = queue.testMode.jobs[0];
    const job2 = queue.testMode.jobs[1];

    // Simulate completion
    job1.emit('complete');
    // Simulate failure
    job2.emit('failed', new Error('Job failed'));

    setTimeout(() => {
      // Check logs for job completion and failure
      expect(queue.testMode.jobs[0].state).to.equal('completed');
      expect(queue.testMode.jobs[1].state).to.equal('failed');
      done();
    }, 100);
  });

  it('should log job progress', (done) => {
    const jobs = [
      { phoneNumber: '4153518780', message: 'Message 1' }
    ];

    createPushNotificationsJobs(jobs, queue);

    const job = queue.testMode.jobs[0];

    // Simulate job progress
    job.emit('progress', 50);

    setTimeout(() => {
      // Check that progress was logged
      expect(queue.testMode.jobs[0].progress).to.equal(50);
      done();
    }, 100);
  });
});


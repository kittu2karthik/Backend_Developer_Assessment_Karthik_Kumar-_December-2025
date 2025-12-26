const { Queue } = require('bullmq');
const redis = require('../config/redis');

// Create connection object for BullMQ
const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
  port: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).port : 6379,
  password: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).password : undefined,
};

// Create queues
const codeExecutionQueue = new Queue('code-execution', { connection });
const emailQueue = new Queue('email-notifications', { connection });
const reportQueue = new Queue('report-generation', { connection });

const addCodeExecutionJob = async (jobData) => {
  const job = await codeExecutionQueue.add('execute-code', jobData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 200, // Keep last 200 failed jobs
  });
  return job;
};

const addEmailJob = async (jobData) => {
  const job = await emailQueue.add('send-email', jobData, {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
  return job;
};

const addReportJob = async (jobData) => {
  const job = await reportQueue.add('generate-report', jobData, {
    attempts: 2,
    timeout: 60000, // 1 minute timeout
  });
  return job;
};

const getJobStatus = async (queueName, jobId) => {
  let queue;

  switch (queueName) {
    case 'code-execution':
      queue = codeExecutionQueue;
      break;
    case 'email-notifications':
      queue = emailQueue;
      break;
    case 'report-generation':
      queue = reportQueue;
      break;
    default:
      throw new Error('Invalid queue name');
  }

  const job = await queue.getJob(jobId);

  if (!job) {
    return null;
  }

  const state = await job.getState();

  return {
    id: job.id,
    name: job.name,
    data: job.data,
    state,
    progress: job.progress,
    returnValue: job.returnvalue,
    failedReason: job.failedReason,
    timestamp: job.timestamp,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
  };
};

module.exports = {
  codeExecutionQueue,
  emailQueue,
  reportQueue,
  addCodeExecutionJob,
  addEmailJob,
  addReportJob,
  getJobStatus,
};

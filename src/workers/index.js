const { Worker } = require('bullmq');

const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
  port: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).port : 6379,
  password: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).password : undefined,
};

// Code Execution Worker
const codeExecutionWorker = new Worker(
  'code-execution',
  async (job) => {
    const { code, language, workspaceId, userId } = job.data;

    console.log(`⚙️ Executing ${language} code for workspace ${workspaceId}`);

    // Simulated code execution (in production, use Docker containers or sandboxed environments)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate execution time

    const result = {
      status: 'success',
      output: `// Code executed successfully\n// Language: ${language}\n// Lines: ${
        code.split('\n').length
      }`,
      executionTime: 2.34,
      timestamp: new Date(),
    };

    return result;
  },
  {
    connection,
    concurrency: 5,
  }
);

// Email Worker
const emailWorker = new Worker(
  'email-notifications',
  async (job) => {
    const { to, subject, body, type } = job.data;

    console.log(`📧 Sending ${type} email to ${to}`);

    // Simulated email sending (in production, use SendGrid, AWS SES, etc.)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      status: 'sent',
      messageId: `msg_${Date.now()}`,
      timestamp: new Date(),
    };
  },
  {
    connection,
    concurrency: 10,
  }
);

// Report Generation Worker
const reportWorker = new Worker(
  'report-generation',
  async (job) => {
    const { reportType, workspaceId, dateRange } = job.data;

    console.log(`📊 Generating ${reportType} report for workspace ${workspaceId}`);

    // Simulated report generation
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return {
      status: 'completed',
      reportUrl: `https://example.com/reports/${workspaceId}_${Date.now()}.pdf`,
      fileSize: '2.3 MB',
      timestamp: new Date(),
    };
  },
  {
    connection,
    concurrency: 2,
  }
);

// Worker event handlers
[codeExecutionWorker, emailWorker, reportWorker].forEach((worker) => {
  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} in queue ${worker.name} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job.id} in queue ${worker.name} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error(`Worker ${worker.name} error:`, err);
  });
});

console.log('✅ Background workers started');

module.exports = {
  codeExecutionWorker,
  emailWorker,
  reportWorker,
};

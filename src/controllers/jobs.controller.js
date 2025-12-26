const queueService = require('../services/queue.service');

const executeCode = async (req, res, next) => {
  try {
    const { code, language, workspaceId } = req.body;

    const job = await queueService.addCodeExecutionJob({
      code,
      language,
      workspaceId,
      userId: req.user.id,
    });

    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
        status: 'queued',
        message: 'Code execution job queued',
      },
    });
  } catch (error) {
    next(error);
  }
};

const sendEmail = async (req, res, next) => {
  try {
    const { to, subject, body, type } = req.body;

    const job = await queueService.addEmailJob({
      to,
      subject,
      body,
      type,
      userId: req.user.id,
    });

    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
        status: 'queued',
        message: 'Email job queued',
      },
    });
  } catch (error) {
    next(error);
  }
};

const generateReport = async (req, res, next) => {
  try {
    const { reportType, workspaceId, dateRange } = req.body;

    const job = await queueService.addReportJob({
      reportType,
      workspaceId,
      dateRange,
      userId: req.user.id,
    });

    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
        status: 'queued',
        message: 'Report generation job queued',
      },
    });
  } catch (error) {
    next(error);
  }
};

const getJobStatus = async (req, res, next) => {
  try {
    const { queueName, jobId } = req.params;

    const status = await queueService.getJobStatus(queueName, jobId);

    if (!status) {
      const error = new Error('Job not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  executeCode,
  sendEmail,
  generateReport,
  getJobStatus,
};

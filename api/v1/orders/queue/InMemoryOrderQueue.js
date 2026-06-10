export class InMemoryOrderQueue {
  constructor({ maxRetries = 3 } = {}) {
    this.maxRetries = maxRetries;
    this.pending = [];
    this.processing = [];
    this.deadLetter = [];
  }

  enqueue(order) {
    const job = {
      id: `job_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      order,
      attempts: 0,
      status: 'queued',
      createdAt: new Date().toISOString()
    };
    this.pending.push(job);
    return job;
  }

  async process(handler) {
    const job = this.pending.shift();
    if (!job) return null;
    job.status = 'processing';
    job.attempts += 1;
    this.processing.push(job);
    try {
      const result = await handler(job.order);
      job.status = 'processed';
      job.result = result;
      this.processing = this.processing.filter(item => item.id !== job.id);
      return job;
    } catch (error) {
      this.processing = this.processing.filter(item => item.id !== job.id);
      job.lastError = error.message;
      if (job.attempts >= this.maxRetries) {
        job.status = 'dead-letter';
        this.deadLetter.push(job);
      } else {
        job.status = 'retrying';
        this.pending.push(job);
      }
      return job;
    }
  }

  snapshot() {
    return {
      queued: this.pending.length,
      processing: this.processing.length,
      deadLetter: this.deadLetter.length
    };
  }
}

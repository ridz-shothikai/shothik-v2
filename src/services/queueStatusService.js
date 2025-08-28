export class QueueStatusService {
  static async getQueueStats() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX}/deep-research/research/queue/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch queue stats:", error);
      return { research: { waiting: 0, active: 0 } };
    }
  }

  static async hasActiveResearch() {
    const stats = await this.getQueueStats();
    return stats.research.active > 0 || stats.research.waiting > 0;
  }

  static async getJobStatus(jobId) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX}/deep-research/research/job/${jobId}/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch job status:", error);
      return null;
    }
  }

  static isJobCompleted(jobStatus) {
    return jobStatus && jobStatus.status === "completed";
  }

  static isJobActive(jobStatus) {
    return (
      jobStatus &&
      (jobStatus.status === "active" || jobStatus.status === "waiting")
    );
  }
 
  static isJobFailed(jobStatus) {
    return jobStatus && jobStatus.status === "failed";
  }
}
